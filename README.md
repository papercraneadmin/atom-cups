# Media Orbit Demo

A responsive web demo featuring a circular orbit display for desktop and a slider for mobile devices.

## Usage

Run `php -S localhost:8000` to view the project locally in your browser.

## Structure

- `index.php` - Main HTML structure
- `style.css` - All styling
- `script.js` - JavaScript functionality
- `data.json` - Content for orbit/slider items

You can easily add or remove items by editing the data.json file.

## WordPress ACF Block Integration

To use this as an ACF block in WordPress:

1. Register the block in your theme's functions.php:

```php
function register_acf_blocks() {
    register_block_type(__DIR__ . '/blocks/media-orbit');
}
add_action('init', 'register_acf_blocks');
```

2. Create a block.json file in your block directory:

```json
{
    "name": "acf/media-orbit",
    "title": "Media Orbit",
    "description": "A circular orbit display for desktop and slider for mobile",
    "category": "media",
    "icon": "format-gallery",
    "apiVersion": 2,
    "acf": {
        "mode": "preview",
        "renderTemplate": "template.php"
    },
    "supports": {
        "align": true
    }
}
```

3. Set up the following ACF fields:

- **Superheading** (Text)
- **Heading** (Text)
- **Subheading** (Textarea)
- **Link** (Link)
- **Media Items** (Repeater - min: 3, max: 8)
  - **Image** 
  - **Video** (File - restrict to video)

4. Copy the code from index.php, style.css, and script.js to your block directory, and adjust as needed based on the commented instructions in the template.
