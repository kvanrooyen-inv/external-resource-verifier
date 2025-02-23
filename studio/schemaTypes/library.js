import {defineField, defineType} from 'sanity'

export const libraries = defineType({
  name: 'library',
  title: 'Library Detection Rules',
  type: 'document',
  fields: [
    {
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      description: 'The name shown to users (e.g., "Bootstrap", "React")',
      validation: Rule => Rule.required()
    },
    {
      name: 'identifier',
      title: 'Identifier',
      type: 'slug',
      description: 'Unique identifier for the library (e.g., "bootstrap", "react")',
      options: {
        source: 'displayName',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'keywords',
      title: 'Detection Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords to search for in the HTML/JS code',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'syntaxHighlightType',
      title: 'Syntax Highlight Type',
      type: 'string',
      options: {
        list: [
          { title: 'HTML', value: 'html' },
          { title: 'JavaScript', value: 'javascript' }
        ]
      },
      initialValue: 'html',
      description: 'Type of syntax highlighting to use for detected code'
    }
  ]
})
