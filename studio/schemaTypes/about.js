import {defineField, defineType} from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About the Tool',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for the about section',
      validation: Rule => Rule.required()
    },
    {
      name: 'aboutDesc',
      title: 'About',
      type: 'array',
      of: [{type: 'block'}],
      description: 'About the tool and how it works. You can add formatting and links here.',
      validation: Rule => Rule.required()
    }
  ]
})
