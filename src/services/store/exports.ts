/**
 * Модули действий и связанные с ним стейты в redux
 */
import { default as categories } from './categories';
import { default as articles } from './articles';
import { default as formLogin } from './form-login';
import { default as modals } from './modals';
import { default as session } from './session';

export const modules = {
    articles: articles,
    categories: categories,
    formLogin: formLogin,
    modals: modals,
    session: session,
    base: {} as any
}