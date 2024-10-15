export default (isEditing: boolean) => ({
  control: {
    fontSize: 14,
    fontWeight: 500,
    borderColor: 'transparent',
    borderRadius: 4,
  },

  '&multiLine': {
    control: {
      backgroundColor: isEditing ? '#E2EDFB' : 'white',
    },
    highlighter: {
      padding: '2px 4px',
      border: 'none',
      color: '#319CFF',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 1,
    },
    input: {
      color: '#37352F',
      padding: '2px 4px',
      outline: 'none',
    },
  },

  suggestions: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'hsl(240 5.9% 90%)',
    overflow: 'hidden',
    zIndex: 40,
    minWidth: '200px',
  },
})
