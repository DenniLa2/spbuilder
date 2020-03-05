# SPBUILDER - frontend

## Команды для запуска
```
npm run serve - запуск в режиме development с "горячей" перезагрузкой
npm run serve-prod - билд в режиме production с "горячей" перезагрузкой
npm run dev-build - в режиме development, собирает в папку /dist
npm run build - в режиме production, собирает в папку /dist
```

### Структура папок
```
├── documentation - документация
├── public - статичные файлы
├─┬ src - основые файлы фронтенд приложения
  ├── assets - fonts/css/imagees
  ├── components - общие компоненты, используемые в 2 и более компонентах
  ├── core - глобальные функции, которые вне vue
  ├── i18n - переводы
  ├── mixins - примеси vue
  ├── router - роутинг
  ├── store - vuex 
  └── views - уникальные компоненты

```
### Ссылки
[Авторизация](./documentation/auth.md)
