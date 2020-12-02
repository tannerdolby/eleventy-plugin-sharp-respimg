# eleventy-plugin-sharp-respimg
An Eleventy [paired shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) that transforms large images into resized `.jpeg` and `.webp` formats and generates responsive image markup using `<picture>`.

## What does it do?
It turns paired shortcodes like this:

```js
{% respimage 
    "photo.jpg", 
    "Some alt text", 
    "./images/",
    { small: 320, med: 640, large: 1024 },
    "(min-width: 450px) 33.3vw, 100vw",
%}{% endrespimage %}
```

into responsive image markup using `<picture>` tags like this:

```html
 <picture>
    <source 
        type="image/webp"
        srcSet="/images/photo-large.webp 1024w,
                /images/photo-med.webp 640w,
                /images/photo-small.webp 320w"
        sizes="(min-width: 450px) 33.3vw, 100vw"
    >
    <img 
        srcSet='/images/photo-large.jpg 1024w,
                /images/photo-med.jpg 640w,
                /images/photo-small.jpg 320w'
        sizes='(min-width: 450px) 33.3vw, 100vw'
        src='photo-small.jpg'
        alt='Some alt text'
        loading='lazy'
    >
</picture>
```

## Transform mulitple images from other data sources
The real power of using paired shortcodes is the ability to use data from [global data files](https://www.11ty.dev/docs/data-global/) or [front matter](https://www.11ty.dev/docs/data-frontmatter/) as arguments.

If you have global JSON data like this (`data.json`),

```json
[
    {
        "src": "car.jpg",
        "imgDir": "./images/",
        "alt": "A picture of a car",
        "sizes": "(min-width: 450px) 33.3vw, 100vw",
        "widths": {
            "small": "320",
            "med": "640",
            "large": "1024"
        }
    },
    {
        "src": "flower.jpg",
        "imgDir": "./images/",
        "alt": "A picture of a flower",
        "sizes": "(min-width: 450px) 33.3vw, 100vw",
        "widths": {
            "small": "320",
            "med": "640",
            "large": "1024"
        }
    }
```
you can use the paired shortcode to transform multiple images into responsive image markup using a `for` loop like this,

```js
{% for image in data %}
    {% respimage 
        item.src, 
        item.alt, 
        item.imgDir,
        item.widths, 
        item.sizes 
    %}{% endrespimage %}
{% endfor %}
```

## TODO
- [ ] Add support for more custom widths, currently only supports (1024, 640, 320)
- [ ] If an image is smaller than 1024px, figure out what sizes to resize too or whether images must be larger than 1024px to perform image transformations.

## Other Responsive Image Plugins
- [eleventy-img](https://github.com/11ty/eleventy-img)
- [eleventy-respimg](https://github.com/eeeps/eleventy-respimg)
- [eleventy-plugin-responsive-images](https://github.com/adamculpepper/eleventy-plugin-responsive-images)