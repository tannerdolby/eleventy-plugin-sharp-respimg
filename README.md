# eleventy-plugin-sharp-respimg
An Eleventy [paired shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) that transforms large images into resized `.jpeg` and `.webp` formats and generates responsive image markup using `<picture>`.

## What does it do?
It turns paired shortcodes like this:

{% raw %}
```js
{% respimage 
    "image.jpg", 
    "Some alt text", 
    "{ small: 320, med: 640, large: 1024 }",
    "(min-width: 450px) 33.3vw, 100vw",
    "./images/"
%}
{% endrespimage %}
```
{% endraw %}

into responsive image markup using `<picture>` tags like this:

```html
 <picture>
    <source 
        type="image/webp"
        srcSet="/images/test-large.webp 1024w,
                /images/test-med.webp 640w,
                /images/test-small.webp 320w"
        sizes="(min-width: 450px) 33.3vw, 100vw"
    >
    <img 
        srcSet='/images/test-large.jpg 1024w,
                /images/test-med.jpg 640w,
                /images/test-small.jpg 320w'
        sizes='(min-width: 450px) 33.3vw, 100vw'
        src='test-small.jpg'
        alt='some alt text'
        loading='lazy'
    >
</picture>
```

## Use Other Data Sources
The real power of using paired shortcodes is the ability to use data from [global data files](https://www.11ty.dev/docs/data-global/) or [front matter](https://www.11ty.dev/docs/data-frontmatter/) as arguments.

If you have global `.json` data like this,

```json
{
    "src": "test.png",
    "alt": "some alt text",
    "sizes": "(min-width: 450px) 33.3vw, 100vw",
    "widths": {
        "small": "320",
        "med": "640",
        "large": "1024"
    }
}
```
you can use the paired shortcode to generate `<picture>` tags like this,

{% raw %}
```js
{% respimage 
    item.src, 
    item.alt, 
    item.size, 
    item.sizes, 
    "./images/", 
    "my-img" 
%}
{% endrespimage %}
```
{% endraw %}