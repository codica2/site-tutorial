<h1 align="center">Site-Tutorial</h1>

Is easy, animated, a lot of functionality, flexible, step tutorial for your site.

<p align="center"> 
 <img width="100%" src="gifs/gautocomplete.gif" >
</p>

## Getting started

Just download plugin and include to your HTML. 

```html
<!-- JS file -->
<script src="path/to/site-tutorial.js"></script>
```

Site-Tutorial is very simple to use. 

1. Choose node elements which you want to see highlighted and set it main attribute `site-tutorial-step="1"` with step parameter;
2. Also you can add `tutorial-title="title"` and `tutorial-text="text"` attributes for title and text respectively;
3. Create button for start tutorial and set `id="start-site-tutorial"`;
4. Create js file and create object and pass options to argument `new SiteTutorial(options)`;
5. Enjoy.

<h3>HTML</h3>

```html
<div site-tutorial-step="1" tutorial-title="Title 1" tutorial-text="Text" />
<div site-tutorial-step="2" tutorial-title="Title 2" tutorial-text="Text" />
```

<h3>JavaScript</h3>

```javascript
var options = { time: 1500 };

new SiteTutorial(options);
```

## Data types

HV-Autocomplete get two data types: **default**, **for categories**.

<h4>Default</h4>

```json
[
  {"name": "Alex", "url": "http://..."},
  {"name": "Page", "url": "http://..."},
  ...
]
```

<h4>For categories</h4>

```json
{
  "category1": {
    "title": "Category 1",
    "data": [
      {
        "name": "Page Warner",
        "url": "http://..."
      },
      ... ]
  },
  "category2": {
    "title": "Category 2",
    "data": [
      {
        "name": "Golden Curtis",
        "url": "http://..."
      },
      ... ]
  },
  ...
}
```

## Acync get data

If you want to load your asynchronous data you can pass function to option `data`. Function must return object of shape. See example below.

```javascript
var options = {
  input: document.querySelector("#main"),
  asyncData: function(input) {
    return {
      method: "GET",
      url: "/search/data.json?query=" + input.value,
      success: function(response) {
        console.log(response);
      }
    };
  }
};

new HVAutocomplete(options);
```


## Categories

With HV-Autocomplete you can separate your data to categories. For this use `categories: true` option.

<h4>Example</h4>

<p align="center"> 
 <img width="100%" src="gifs/gautocomplete3.gif" >
</p>

<h4>Code</h4>

```javascript
var options = {
  input: document.querySelector("#input"),
  data: data
};

new HVAutocomplete(options);
```

<h4>Data type</h4>

```json
{
  "category1": {
    "title": "Category 1",
    "data": [
      {
        "name": "Page Warner",
        "url": "http://..."
      },
      ... ]
  },
  "category2": {
    "title": "Category 2",
    "data": [
      {
        "name": "Golden Curtis",
        "url": "http://..."
      },
      ... ]
  },
  ...
}
```

## Horizontal categories

We want that user can use HV-Autocomplete in horizontal orientation. For this simple use right data type - see above.

<p align="center"> 
 <img width="100%" src="gifs/gautocomplete.gif" >
</p>

<h4>Code</h4>

```javascript
var options = {
  input: document.querySelector("#input"),
  data: data,
  horizontal: true
};

new HVAutocomplete(options);
```

## Search

HV-Autocomplete has two search methods for your convenience:
- Default search
- Global search - looking all matches after space. For this search use `globalSearch: true`

<h4>Example</h4>

<p align="center"> 
 <img width="100%" src="gifs/gautocomplete4.gif" >
</p>

<h4>Code</h4>

```javascript
var options = {
  input: document.querySelector("#input"),
  data: data,
  globalSearch: true
};

new HVAutocomplete(options);
```

## Styling

We took care that styling will easy, so include two options for this:

- `resultClass`
- `resultStyles`

<h4>resultClass</h4>

It option replase default class to your class result block and child nodes.

For example:

```
div.hv-result => div.your-class-result
  └── p.hv-element-no-category => div.your-class-element-no-category
```

<h4>resultStyles</h4>

It options set inline styles for result block.

## Structure child nodes result block

<h4>Default structure</h4>

```
div.hv-result
  └── a.hv-element-no-category          => option
```

<h4>Structure with category</h4>

```
div.hv-result
  └── div.hv-block-category             => block if has category
        ├── h3.hv-title-category        => title category
        └── a.hv-element-with-category  => option
```

## Event `onOptionClick`

This event is calling when click on option and return `event`, `name`, `url`, `nameCategory` parameters.

<h4>Example</h4>

```javascript
var options = {
  input: document.querySelector("#input"),
  data: data,
  onOptionClick: function(event, name, url, nameCategory){
    console.log(name);
  }
};

new HVAutocomplete(options);
```

## API

| Options         | Default value | Type             | Description                                  |
| --------------- | ------------- | ---------------- | -------------------------------------------- |
| `data`          | `none`        | **object**       | See above. `Required field`                  |
| `input`         | `none`        | **HTML element** | Set HTML element. `Required field`           |
| `maxLength`     | `5`           | **number**       | Set maximum search result.                   |
| `horizontal`    | `false`       | **boolean**      | Set your autocomplete horizontal  See above. |
| `globalSearch`  | `false`       | **boolean**      | Set type search. See above.                  |
| `resultClass`   | `hv-result`   | **string**       | Set class for result. See above.             |
| `resultStyles`  | `null`        | **object**       | Set inline styles for result. See above.     |
| `onOptionClick` | `null`        | **function**     | Callback after click on option               |


## License

hv-autocomplete is Copyright © 2015-2018 Codica. It is released under the [MIT License](https://opensource.org/licenses/MIT).

## About Codica

[![Codica logo](https://www.codica.com/assets/images/logo/logo.svg)](https://www.codica.com)

We love open source software! See [our other projects](https://github.com/codica2) or [hire us](https://www.codica.com/) to design, develop, and grow your product.
