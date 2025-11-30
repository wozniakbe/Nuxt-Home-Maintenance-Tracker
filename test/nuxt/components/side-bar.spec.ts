// components/side-bar.spec.ts

import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import SideBar from "../../../app/components/side-bar.vue";

describe("side-bar Component", () => {
  it("mounts and renders the main heading", async () => {
    // 1. Mount the component
    const wrapper = await mountSuspended(SideBar);

    // 2. Find the heading element
    const heading = wrapper.find("h3");

    // 3. Assert that the heading exists and has the correct text
    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe("Side Bar");
  });

  it("renders exactly 3 SVG icons", async () => {
    // 1. Mount the component
    const wrapper = await mountSuspended(SideBar);

    // 2. Find all SVG elements
    const svgIcons = wrapper.findAll("svg");

    // 3. Assert that the number of SVGs is correct
    expect(svgIcons).toHaveLength(3);
  });
});
