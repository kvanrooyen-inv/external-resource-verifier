import {defineField, defineType} from 'sanity'

export const update = defineType({
  name: 'update',
  title: 'Content Updates',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Update Title',
      type: 'string',
      description: 'A brief summary of the update',
      validation: Rule => Rule.required()
    },
    {
      name: 'updateDescription',
      title: 'Update Desciription',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      description: 'When this update was released'
    }
  ]
})
