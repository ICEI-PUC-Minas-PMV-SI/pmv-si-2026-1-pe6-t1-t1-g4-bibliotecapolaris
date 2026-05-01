import Link from 'next/link';

type Review = {
  id: string;
  userName: string;
  userSlug: string;
  rating: number;
  description?: string;
  date: string;
};

type ReviewSectionProps = {
  reviews: Review[];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${star <= rating ? 'text-(--button-active)' : 'text-(--text) opacity-30'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Link href={`/Users/${review.userSlug}`}>
      <article className="border border-(--text) p-6 rounded-sm flex flex-col gap-4 hover:opacity-80">
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-row gap-8">
            <h3 className="flex-1 font-serif text-2xl font-bold tracking-wider uppercase border-b-2 border-(--button-active) line-clamp-1">
              {review.userName}
            </h3>
            <h3 className="font-serif text-xl font-bold tracking-wider uppercase">{review.date}</h3>
          </div>
          <StarRating rating={review.rating} />
        </div>
        <p className="min-h-25 font-sans font-light text-base text-justify leading-relaxed wrap-break-word line-clamp-4">
          {review.description}
        </p>
      </article>
    </Link>
  );
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <>
        <h2 className="font-serif text-3xl uppercase mb-6">Avaliações</h2>
        <p className="font-serif text-3xl uppercase text-center">Nenhuma avaliação para esse livro.</p>
      </>
    );
  }

  return (
    <>
      <h2 className="font-serif text-3xl uppercase mb-6">Avaliações</h2>
      <div className="grid grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </>
  );
}
