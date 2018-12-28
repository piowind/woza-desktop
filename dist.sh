rm -rf build
rm -rf dist

# build react
npm run build

# pack electron
npm run dist
