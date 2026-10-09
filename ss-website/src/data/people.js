/**
 * Generates invented (but realistic) Indian student records for the starting
 * data — so counters like "Volunteer Slots 14 / 20" look lived-in.
 * Deterministic: the same names come out every time.
 */
const first = ['Aarav', 'Ananya', 'Vihaan', 'Diya', 'Arjun', 'Isha', 'Kabir', 'Meera', 'Rohan', 'Saanvi', 'Aditya', 'Kavya', 'Reyansh', 'Tanvi', 'Ishaan', 'Riya', 'Karthik', 'Pooja', 'Nikhil', 'Sneha', 'Varun', 'Aditi', 'Harsh', 'Nandini', 'Siddhant', 'Shreya', 'Yash', 'Lavanya', 'Pranav', 'Bhavya', 'Manav', 'Zoya', 'Dev', 'Anjali', 'Rahul', 'Keerthi', 'Aman', 'Swathi', 'Tejas', 'Fatima']
const last = ['Sharma', 'Reddy', 'Iyer', 'Patel', 'Nair', 'Gupta', 'Rao', 'Khan', 'Menon', 'Joshi', 'Verma', 'Kulkarni', 'Das', 'Pillai', 'Chopra', 'Bose', 'Mehta', 'Naidu', 'Singh', 'Hegde']
const colleges = ['Osmania University', 'JNTU Hyderabad', 'Andhra University', 'Anna University', 'Pune University', 'Delhi University', 'Christ University', 'VIT Vellore']
const cities = ['Hyderabad', 'Visakhapatnam', 'Chennai', 'Pune', 'Delhi', 'Bengaluru', 'Vijayawada', 'Warangal']

export function person(i) {
  const f = first[(i * 7) % first.length]
  const l = last[(i * 11 + 3) % last.length]
  return {
    name: `${f} ${l}`,
    email: `${f}.${l}${i}@example.com`.toLowerCase(),
    phone: `9${String(800000000 + i * 7919).slice(0, 9)}`,
    college: colleges[i % colleges.length],
    city: cities[(i * 3) % cities.length],
  }
}

/** n invented records for a collection, e.g. people(14, 'vol', 0, { eventId: 'evt-1' }) */
export function people(n, prefix, offset = 0, extra = {}, pick) {
  return Array.from({ length: n }, (_, k) => {
    const i = offset + k
    const day = String(1 + (i % 9)).padStart(2, '0')
    return { id: `${prefix}-${i}`, ...person(i), ...extra, ...(pick ? pick(i) : {}), createdAt: `2026-10-${day}T1${i % 10}:00:00Z` }
  })
}
