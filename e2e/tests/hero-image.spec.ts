import { test, expect } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test("hero image covers placeholder", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const placeholder = page.getByTestId("hero-image-placeholder");
  const img = page.getByTestId("hero-image");

  // Ensure image is loaded
  await expect(
    await img.evaluate((el) => (el as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);

  // Check CSS object-fit and position
  const styles = await img.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { objectFit: cs.objectFit, objectPosition: cs.objectPosition };
  });
  expect(styles.objectFit).toBe("cover");
  expect(styles.objectPosition).toBe("50% 50%");

  // Ensure image fills the placeholder across viewports
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForLoadState("networkidle");

    const [placeholderBox, imgBox] = await Promise.all([
      placeholder.boundingBox(),
      img.boundingBox(),
    ]);
    expect(placeholderBox?.width || 0).toBeGreaterThan(0);
    expect(placeholderBox?.height || 0).toBeGreaterThan(0);
    expect(imgBox?.width || 0).toBeGreaterThanOrEqual(
      placeholderBox?.width || 0,
    );
    expect(imgBox?.height || 0).toBeGreaterThanOrEqual(
      placeholderBox?.height || 0,
    );
  }
});
