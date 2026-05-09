import path from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { PrismaClient } = require('./generated/test/client');

const dbPath = path.resolve(__dirname, 'test.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

function slug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function main() {
  // ── Admin user ────────────────────────────────────────────────────────────
  // Upsert on slug so re-running always keeps a known password
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { slug: 'admin-polaris' },
    update: { email: 'admin@polaris.com', password, type: 'administrator', isBlocked: false },
    create: {
      id: randomUUID(),
      slug: 'admin-polaris',
      name: 'Admin Polaris',
      email: 'admin@polaris.com',
      password,
      type: 'administrator',
      isBlocked: false,
    },
  });
  console.log('✔ Admin upserted  →  admin@polaris.com  /  admin123');

  // ── Authors ───────────────────────────────────────────────────────────────
  const authorData = [
    { name: 'J.K. Rowling' },
    { name: 'George R.R. Martin' },
    { name: 'Tolkien, J.R.R.' },
    { name: 'Haruki Murakami' },
  ];

  const authors: Record<string, string> = {};
  for (const a of authorData) {
    const found = await prisma.author.findFirst({ where: { name: a.name } });
    if (found) {
      authors[a.name] = found.id;
      console.log(`  Author already exists — ${a.name}`);
    } else {
      const created = await prisma.author.create({ data: { id: randomUUID(), name: a.name } });
      authors[a.name] = created.id;
      console.log(`✔ Author created — ${a.name}`);
    }
  }

  // ── Books ─────────────────────────────────────────────────────────────────
  const bookData = [
    {
      name: "Harry Potter e a Pedra Filosofal",
      isbn: '9788532511010',
      year: 1997,
      authorName: 'J.K. Rowling',
      description: 'A história de Harry Potter, um jovem bruxo que descobre seu destino ao ingressar na Escola de Magia e Bruxaria de Hogwarts.',
      categories: 'Fantasia,Jovem Adulto',
      totalQuantity: 5,
      imageSrc: '',
    },
    {
      name: 'A Game of Thrones',
      isbn: '9780553103540',
      year: 1996,
      authorName: 'George R.R. Martin',
      description: 'Em Westeros, famílias nobres disputam o Trono de Ferro enquanto uma ameaça antiga se aproxima pelo Norte.',
      categories: 'Fantasia,Épico',
      totalQuantity: 3,
      imageSrc: '',
    },
    {
      name: 'O Senhor dos Anéis: A Sociedade do Anel',
      isbn: '9788533603149',
      year: 1954,
      authorName: 'Tolkien, J.R.R.',
      description: 'Frodo Bolseiro herda um anel mágico e parte em uma perigosa jornada para destruí-lo antes que o Senhor das Trevas o recupere.',
      categories: 'Fantasia,Clássico',
      totalQuantity: 4,
      imageSrc: '',
    },
    {
      name: 'Norwegian Wood',
      isbn: '9780375704024',
      year: 1987,
      authorName: 'Haruki Murakami',
      description: 'Um romance nostálgico sobre amor, perda e amadurecimento no Japão dos anos 1960, narrado pelo jovem Toru Watanabe.',
      categories: 'Romance,Contemporâneo',
      totalQuantity: 2,
      imageSrc: '',
    },
    {
      name: "Harry Potter e a Câmara Secreta",
      isbn: '9788532512529',
      year: 1998,
      authorName: 'J.K. Rowling',
      description: 'No segundo ano em Hogwarts, Harry descobre a Câmara Secreta e enfrenta uma criatura mortal que está petrificando os alunos.',
      categories: 'Fantasia,Jovem Adulto',
      totalQuantity: 5,
      imageSrc: '',
    },
  ];

  for (const b of bookData) {
    const found = await prisma.book.findUnique({ where: { isbn: b.isbn } });
    if (found) {
      console.log(`  Book already exists — ${b.name}`);
      continue;
    }
    await prisma.book.create({
      data: {
        id: randomUUID(),
        slug: slug(b.name),
        isbn: b.isbn,
        name: b.name,
        year: b.year,
        authorId: authors[b.authorName],
        description: b.description,
        categories: b.categories,
        totalQuantity: b.totalQuantity,
        totalAvailable: b.totalQuantity,
        imageSrc: b.imageSrc,
      },
    });
    console.log(`✔ Book created — ${b.name}`);
  }

  // ── Students ──────────────────────────────────────────────────────────────
  const studentData = [
    { name: 'Ana Lima', email: 'ana.lima@unipolaris.br' },
    { name: 'Bruno Carvalho', email: 'bruno.carvalho@unipolaris.br' },
    { name: 'Carla Mendes', email: 'carla.mendes@unipolaris.br' },
    { name: 'Diego Souza', email: 'diego.souza@unipolaris.br' },
    { name: 'Eduarda Ferreira', email: 'eduarda.ferreira@unipolaris.br' },
  ];

  const studentPassword = await bcrypt.hash('aluno123', 10);
  for (const s of studentData) {
    const found = await prisma.user.findUnique({ where: { email: s.email } });
    if (found) {
      console.log(`  Student already exists — ${s.name}`);
      continue;
    }
    await prisma.user.create({
      data: {
        id: randomUUID(),
        slug: slug(s.name),
        name: s.name,
        email: s.email,
        password: studentPassword,
        type: 'student',
        isBlocked: false,
      },
    });
    console.log(`✔ Student created — ${s.name}`);
  }

  console.log('\nDone.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
