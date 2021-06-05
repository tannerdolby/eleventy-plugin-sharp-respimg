# eleventy-plugin-sharp-respimg
An Eleventy [shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) that performs build-time image transformations with [Sharp](https://www.npmjs.com/package/sharp) to resize large images into `.jpeg` and `.webp` formats with varying dimensions and generates `<picture>` tags for responsive images.

## Installation
In your Eleventy project, [install the plugin](https://www.npmjs.com/package/eleventy-plugin-sharp-respimg) from npm:
```
npm install eleventy-plugin-sharp-respimg
```
Then add it to your [Eleventy Config](https://www.11ty.dev/docs/config/) file:
```js
const respimg = require("eleventy-plugin-sharp-respimg");

module.exports = (eleventyConfig) => {
    eleventyConfig.addPlugin(respimg);
}
```

## What does it do?
It turns paired shortcodes like this:

```js
{% respimg 
    src="car.png", 
    alt="Photo of a car", 
    inputDir="./src",
    imgDir="/images/",
    widths=[320, 640, 1024],
    sizes="(min-width: 450px) 33.3vw, 100vw",
    className="my-image",
    width=1024,
    height=768
%}
```
into responsive image markup using `<picture>` tags like this:
```html
 <picture>
    <source 
        type="image/webp"
        srcSet="/images/car-large.webp 1024w,
                /images/car-med.webp 640w,
                /images/car-small.webp 320w"
        sizes="(min-width: 450px) 33.3vw, 100vw"
    >
    <img 
        srcSet="/images/car-large.jpeg 1024w,
                /images/car-med.jpeg 640w,
                /images/car-small.jpeg 320w"
        sizes="(min-width: 450px) 33.3vw, 100vw"
        src="car-small.jpeg"
        alt="Photo of a car"
        loading="lazy"
        class="my-image"
        width="1024"
        height="768"
    >
</picture>
```
- The images are responsive by using a `<picture>` element which contains zero or more `<source>` elements and one `<img>` element to offer alternative versions of an image for different display/device scenarios. 
- Using `srcset` and `sizes`, you can deliver [variable-resolution images](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/), which respond to variable layout widths and screen densities.

## Usage Options
Supply the values as name=value pairs to the shortcode like shown in the example above. 

You can also use global data or front matter to supply values to the shortcode like this:

```nunjucks
---
src: yellow-modern.png
alt: Some alt text
inputDir: ./src
imgDir: /images/
widths: 
    - 320
    - 640
    - 1024
sizes: "(min-width: 450px) 33.3vw, 100vw"
className: test-class
width: 1024
height: 768
---
{% respimg
    src=src,
    alt=alt,
    inputDir=inputDir,
    imgDir=imgDir,
    widths=widths,
    sizes=sizes,
    className=class,
    width=width,
    height=height
%}
```

Or in a one liner by defining an object with the required properties:

```nunjucks
---
data:
    src: yellow-modern.png
    alt: Some alt text
    inputDir: ./src
    imgDir: /images/
    widths: 
        - 320
        - 640
        - 1024
    sizes: "(min-width: 450px) 33.3vw, 100vw"
    className: test-class
    width: 1024
    height: 768
---

{% respimg data %}
```

### Using the paired shortcode more than once for the same image
If you have already used the utility to transform an image and you call `respimg` within your code again for the same file, it will generate the responsive image markup using `<picture>` for that image and generate new images if the shortcode parameters change. 

## Transform mulitple images
The real power of using this paired shortcode is the ability to use data from [global data files](https://www.11ty.dev/docs/data-global/) or [front matter](https://www.11ty.dev/docs/data-frontmatter/) to transform multiple images at once.

If you have global JSON data stored in `data.json` or in front matter which is an array of objects like this:

```json
[
    {
        "src": "car.png",
        "alt": "Photo of a car",
        "inputDir": "./src",
        "imgDir": "/images/",
        "widths": {
            "small": 320,
            "med": 640,
            "large": 1024
        },
        "sizes": "(min-width: 450px) 33.3vw, 100vw",
        "class": "my-image",
        "width": 1024,
        "height": 768
    },
    {
        "src": "flower.png",
        "alt": "Photo of a flower",
        "imgDir": "./images/",
        "widths": {
            "small": 400,
            "med": 600,
            "large": 1024
        },
        "sizes": "(min-width: 450px) 33.3vw, 100vw",
        "class": "my-image",
        "width": 1024,
        "height": 768
    }
]
```
you can use the paired shortcode to transform multiple images with varying dimensions into responsive image markup using a `for` loop like this:

```js
{% for image in data %}
    {% respimg 
        src=image.src, 
        alt=image.alt, 
        inputDir="./src",
        imgDir=image.imgDir,
        widths=image.widths, 
        sizes=image.sizes,
        className=image.class,
        width=image.width,
        height=image.height
    %}
{% endfor %}
```

## Paired shortcode options

| Parameter | Type | Description |
| ----------| -----|-------------|
| src       | `string` | The filename for an image. |
| alt       | `string` | A text description of the image. |
| inputDir  | `string` | The `input` directory in your Eleventy config file. |
| imgDir    | `string` | The directory where the image file is located. Relative to `inputDir`. |
| widths    | `int[]` or `string[]` | The desired image widths. Supports any three values. Must provide atleast 3 values in ascending order. (small, med, large) |
| sizes     | `string` | The `sizes` attribute which defines a set of media conditions. |
| id | `string` | The `id` attribute for `<img>` elements inside the generated `<picture>`. Remember `id`'s may only be used once on a page, they must be unique and cannot repeat. |
| className     | `string` | Class name for the fallback image.   |
| width     | `int` | The fallback image `width` attribute.  |
| height    | `int` | The fallback image `height` attribute. |
| fallbackSrcWidth | `int` | Width of the fallback image in the `src` attribute. |
| quality   | `int` | The quality for Sharp to generate images width. (Default: 85) |
| overwrite | `boolean` | Determines if Sharp generates another set of images for a given input. Make sure this is `false` when serving locally. (Default: false)
| debug | `boolean` | A boolean to include console output of generated image metadata. |

## Notes
- Use `./` when declaring the `inputDir` parameter as Sharp expects this.
- Use `.addPassthroughCopy` to include the images directory in your `_site` output e.g. `eleventyConfig.addPassthroughCopy("./src/images/");`.
- The `<picture>` and `<img>` tags generated by the paired shortcode don't have any styling out of the box. But they can be manipulated with a bit of CSS to apply different `width` or `height` attributes.

Recommended fallback `<img>` boilerplate CSS:
```css
.my-image {
    max-width: 100%;
    object-fit: cover;
    height: auto;
    margin: 0 auto;
}
```

## Maintainers
[@tannerdolby](https://github.com/tannerdolby)

## Other Responsive Image Plugins
- [eleventy-img](https://github.com/11ty/eleventy-img)
- [eleventy-respimg](https://github.com/eeeps/eleventy-respimg)