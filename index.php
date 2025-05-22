<?php
// Load JSON data
$jsonData = file_get_contents('data.json');
$data = json_decode($jsonData, true);
$content = $data['content'];
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
        <h4><?= $content['superheading'] ?></h4>
        <h1><?= $content['heading'] ?></h1>
        <h3><?= $content['subheading'] ?></h3>
        <a href="<?= $content['link']['url'] ?>" class="demo-button" <?= $content['link']['target'] ? 'target="' . $content['link']['target'] . '"' : '' ?>><?= $content['link']['text'] ?></a>
      </div>
      <div class="media-orbit">
        <div class="orbit-container-wrapper">
          <div class="orbit-container">
            <?php foreach($orbitItems as $index => $item): ?>
              <div class="orbit-item" data-index="<?= $index ?>">
                <?php if(!empty($item['video'])): ?>
                  <video muted loop autoplay playsinline webkit-playsinline>
                    <source src="<?= $item['video'] ?>" type="video/mp4">
                  </video>
                <?php else: ?>
                  <img src="<?= $item['image'] ?>" alt="<?= $item['alt'] ?>">
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile Hero Slider Section -->
  <section class="hero-slider mobile-only">
    <div class="slider">
      <?php foreach($orbitItems as $index => $item): ?>
        <div class="slider-item <?= $index === 0 ? 'active' : '' ?>" data-index="<?= $index ?>">
          <?php if(!empty($item['video'])): ?>
            <video muted loop autoplay playsinline webkit-playsinline>
              <source src="<?= $item['video'] ?>" type="video/mp4">
            </video>
          <?php else: ?>
            <img src="<?= $item['image'] ?>" alt="<?= $item['alt'] ?>">
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
    
    <div class="content">
      <h4><?= $content['superheading'] ?></h4>
      <h1><?= $content['heading'] ?></h1>
      <h3><?= $content['subheading'] ?></h3>
      <a href="<?= $content['link']['url'] ?>" class="demo-button" <?= $content['link']['target'] ? 'target="' . $content['link']['target'] . '"' : '' ?>><?= $content['link']['text'] ?></a>
    </div>
  </section>
</body>
</html> 