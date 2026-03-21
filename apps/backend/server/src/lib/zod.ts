import zod from 'zod';
import { pt } from 'zod/locales';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

zod.config(pt());

extendZodWithOpenApi(zod);

export { zod as z };
