# Blog Images

Place blog post images in subdirectories matching the post slug:

```
public/blog-images/
  fadcam-iphone-release/
    hero.png
    screenshot-settings.png
  another-post-slug/
    diagram.svg
    demo.mp4
```

Then reference them in markdown:

```md
![Hero screenshot](/blog-images/fadcam-iphone-release/hero.png)
```

Images in `public/` are served as static files at the root URL by Vite —
no imports needed, just use the path directly.
