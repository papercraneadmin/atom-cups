<?php
// Load JSON data
$jsonData = file_get_contents('data.json');
$data = json_decode($jsonData, true);
$orbitItems = $data['orbitItems'];

/**
 * ACF Block Integration
 * 
 * To use this as an ACF block in WordPress:
 * 
 * 1. Replace the JSON data loading with ACF fields:
 *    $heading = get_field('heading');
 *    $superheading = get_field('superheading');
 *    $subheading = get_field('subheading');
 *    $link = get_field('link');
 *    $orbitItems = get_field('media_items');
 * 
 * 2. Check for minimum/maximum items in the repeater:
 *    if (count($orbitItems) < 3) { 
 *        // Show error or fallback content
 *    }
 *    $orbitItems = array_slice($orbitItems, 0, 8); // Limit to maximum 8
 * 
 * 3. Adjust HTML structure below to use ACF fields instead of hardcoded content
 *    Replace static text with $heading, $superheading, $subheading, etc.
 *    Use $link['url'], $link['title'], $link['target'] for the button
 * 
 * 4. For media items, check type based on file extension:
 *    $isVideo = in_array(pathinfo($item['file']['url'], PATHINFO_EXTENSION), ['mp4', 'webm']);
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Media Orbit Demo</title>
  <link rel="stylesheet" href="style.css">
  <script src="script.js"></script>
</head>
<body>
  <!-- Desktop Orbit Section -->
  <section class="orbit-section desktop-only">
    <div class="demo-container">
      <div class="demo-text">
        <h4>Superheading</h4>
        <h1>This is your heading</h1>
        <h3>This is some supporting text to go with the heading.</h3>
        <a href="#" class="demo-button">Learn More</a>
      </div>
      <div class="media-orbit">
        <div class="orbit-container">
          <?php foreach($orbitItems as $index => $item): ?>
            <div class="orbit-item" data-index="<?= $index ?>">
              <?php if($item['type'] === 'image'): ?>
                <img src="<?= $item['src'] ?>" alt="<?= $item['alt'] ?>">
              <?php elseif($item['type'] === 'video'): ?>
                <video muted loop playsinline webkit-playsinline>
                  <source src="<?= $item['src'] ?>" type="video/mp4">
                </video>
              <?php endif; ?>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile Hero Slider Section -->
  <section class="hero-slider mobile-only">
    <div class="slider">
      <?php foreach($orbitItems as $index => $item): ?>
        <div class="slider-item <?= $index === 0 ? 'active' : '' ?>" data-index="<?= $index ?>">
          <?php if($item['type'] === 'image'): ?>
            <img src="<?= $item['src'] ?>" alt="<?= $item['alt'] ?>">
          <?php elseif($item['type'] === 'video'): ?>
            <video muted loop autoplay playsinline webkit-playsinline>
              <source src="<?= $item['src'] ?>" type="video/mp4">
            </video>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
    
    <div class="content">
      <h4>Superheading</h4>
      <h1>This is your heading</h1>
      <h3>This is some supporting text to go with the heading.</h3>
      <a href="#" class="demo-button">Learn More</a>
    </div>
  </section>
</body>
</html> 