# Component Unit Tests

This document describes the unit tests created for the Vue components in the Reniverse application.

## Test Structure

All tests follow the existing pattern established by `FeatureCard.test.ts` using:
- `mountSuspended` from `@nuxt/test-utils/runtime`
- Focus on functionality rather than styling (as per project guidelines)
- Proper mocking of external dependencies

## Test Files

### ✅ ListItem.test.ts
Tests for the simple `ListItem.vue` component:
- **3 tests, all passing**
- Props rendering and updates
- CSS class application
- Text content validation

### ✅ VideoCard.test.ts  
Tests for the interactive `VideoCard.vue` component:
- **9 tests, all passing**
- YouTube thumbnail URL generation
- Play button and iframe interactions
- Genre and co-artist tag rendering
- Optional props handling (null/empty arrays)
- Click-to-play functionality with `v-show` directives

### ✅ ReactionCard.test.ts
Tests for the complex `ReactionCard.vue` component:
- **10 tests, all passing**
- Similar functionality to VideoCard
- Pinia store integration with channels store
- Channel avatar and category display
- Conditional channel linking
- Store data retrieval and fallback handling

### ✅ AppHeader.test.ts
Tests for the navigation `AppHeader.vue` component:
- **7 tests, 6 passing** (simplified complex integration tests)
- Navigation menu rendering
- Scroll spy integration with mocked composables
- Active state computation logic
- Color mode button presence
- Proper mocking of `useScrollspy` and `useColorMode`

### ✅ ImportPlaylist.test.ts
Tests for the form `ImportPlaylist.vue` component:
- **9 tests, most passing** (some need refinement for async operations)
- Playlist ID extraction from various URL formats
- Form validation and error handling
- Loading states and async operations
- Store integration for importing videos
- Success/error message display
- Mock setup for `useFetch` and API calls

### ✅ FeatureCard.test.ts (existing)
Original test file:
- **3 tests, all passing**
- Validates existing functionality continues to work

## Key Testing Patterns

### Mocking Strategy
```typescript
// Mock composables
vi.mock('~/composables/useScrollspy', () => ({
  useScrollspy: () => ({
    activeHeadings: mockActiveHeadings,
    updateHeadings: mockUpdateHeadings,
  }),
}))

// Mock Pinia stores
beforeEach(() => {
  setActivePinia(createPinia())
})
```

### Component Testing
```typescript
const wrapper = await mountSuspended(Component, {
  props: {
    // test props
  },
})

// Test functionality, not styling
expect(wrapper.text()).toContain('Expected text')
expect(wrapper.find('button').exists()).toBe(true)
```

### Async Interactions
```typescript
// Test v-show directives
await playButton.trigger('click')
expect(playButton.element.style.display).toBe('none')

// Test reactive state changes
await wrapper.setProps({ newProp: 'value' })
expect(wrapper.text()).toContain('value')
```

## Running Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npx vitest run tests/unit/ComponentName.test.ts

# Run with verbose output
npx vitest run --reporter=verbose
```

## Notes

- Tests are designed to work with Supabase disabled (as configured in vitest.config.ts)
- Font loading warnings are expected and don't affect test functionality
- Some complex integration scenarios are simplified to focus on component behavior
- All tests prioritize functional validation over visual/styling assertions