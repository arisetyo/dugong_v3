// Load mesages from the database
const loadMessages = async SUPABASE => {
  const { data, error } = await SUPABASE
    .from('guestbook')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching guestbook entries:', error)
    reply.code(500)
  }

  return data
}

export { loadMessages }