import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TitleComponent from '../TitleComponent.vue'

describe('TitleComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(TitleComponent, { props: { title: 'Hello World' } })
    expect(wrapper.text()).toContain('Hello World')
  })
})
