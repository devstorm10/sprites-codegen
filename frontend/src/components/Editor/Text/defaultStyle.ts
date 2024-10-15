export default (isEditing: boolean, hasContent: boolean) => ({
  control: {
    fontSize: 16,
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
      color: hasContent ? '#37352F' : '#37352f80',
      padding: '2px 4px',
      outline: 'none',
    },
  },

  suggestions: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'hsl(240 5.9% 90%)',
    overflow: 'hidden',
    zIndex: 40,
    minWidth: '250px',
    boxShadow: '0 0 16px rgba(0,0,0,0.04)',
    marginTop: 24,
    padding: 3,
  },
})
