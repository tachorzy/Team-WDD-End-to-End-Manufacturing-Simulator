npm ci
[ $? -eq 0 ] || exit 1

npm run lint:fix
[ $? -eq 0 ] || exit 1

npm run build
[ $? -eq 0 ] || exit 1

npm run test:coverage
[ $? -eq 0 ] || exit 1
