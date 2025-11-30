<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        House Maintenance Tracker
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <app-theme-toggle />
      <auth-button />
    </div>
  </div>
</template>
