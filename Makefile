PWD := $(shell pwd)
PATH := ${PWD}/node_modules/.bin:$(PATH)
.SILENT: build clean install release watch
all: install build watch

clean:
	rm -rf packages/tess-calendar/dist

install:
	yarn
	lerna bootstrap

build:
	sass -s compressed --no-charset --no-source-map packages/tess-calendar/assets:packages/tess-calendar/dist
	css2userstyle --no-userscript packages/tess-calendar/dist/theme.css

release:
	sass -s compressed --no-charset --no-source-map packages/tess-calendar/assets:packages/tess-calendar/assets
	postcss packages/tess-calendar/dist/theme.css --use autoprefixer cssnano --replace --no-map

watch:
	chokidar packages/tess-calendar/assets -c 'make -s build'
