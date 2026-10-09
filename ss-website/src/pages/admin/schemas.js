/**
 * ADMIN SCHEMAS — describe each collection once; the admin UI builds the
 * table, forms and child lists from this. To add a field, add it here.
 *
 * field types: text | textarea | number | date | time | url | email | select | checkbox | list
 * (`list` = one item per line, stored as an array)
 */
import { opportunityCategories } from '../../config/site'
import { iconNames } from '../../components/ui/Icon'
import { opportunityStatus } from '../../services/api'
import { formatDate } from '../../utils/format'

const count = (db, coll, key, id) => (db[coll] || []).filter((x) => x[key] === id).length

export const schemas = {
  opportunities: {
    label: 'Opportunities', singular: 'Opportunity',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'category', label: 'Category', type: 'select', options: opportunityCategories, required: true },
      { name: 'organization', label: 'Organisation', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { name: 'eligibility', label: 'Eligibility', type: 'textarea', full: true },
      { name: 'requirements', label: 'Requirements (one per line)', type: 'list', full: true },
      { name: 'deadline', label: 'Deadline', type: 'date', required: true },
      { name: 'mode', label: 'Mode', type: 'select', options: ['Online', 'On-site', 'Hybrid'], required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'stipend', label: 'Stipend / perks', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Open', 'Closed'], hint: 'Auto-closes after the deadline.' },
      { name: 'applyUrl', label: 'External apply link', type: 'url', hint: 'Leave empty to collect applications on SS.' },
      { name: 'featured', label: 'Feature on homepage', type: 'checkbox' },
    ],
    columns: [
      { label: 'Title', get: (r) => r.title, primary: true },
      { label: 'Category', get: (r) => r.category },
      { label: 'Deadline', get: (r) => formatDate(r.deadline) },
      { label: 'Status', get: (r) => opportunityStatus(r) },
      { label: 'Applications', get: (r, db) => count(db, 'applications', 'opportunityId', r.id) },
    ],
    children: [{ collection: 'applications', key: 'opportunityId', label: 'Applications' }],
  },

  events: {
    label: 'Events', singular: 'Event',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'mode', label: 'Mode', type: 'select', options: ['On-site', 'Online', 'Hybrid'], required: true },
      { name: 'startTime', label: 'Start time', type: 'time', required: true },
      { name: 'endTime', label: 'End time', type: 'time' },
      { name: 'venue', label: 'Venue / link info', type: 'text', required: true, full: true },
      { name: 'organizer', label: 'Organiser', type: 'text' },
      { name: 'imageUrl', label: 'Event photo URL', type: 'url', full: true, hint: 'A photo related to the event (Unsplash links are auto-resized). If empty, a brand pattern is shown.' },
      { name: 'tone', label: 'Banner colour (when no image)', type: 'select', options: ['ocean', 'lagoon', 'leaf'] },
      { name: 'description', label: 'Description', type: 'textarea', required: true, full: true },
      { name: 'registrationOpen', label: 'Registrations open', type: 'checkbox' },
      { name: 'registrationCapacity', label: 'Attendee capacity', type: 'number', hint: '0 = unlimited' },
      { name: 'volunteerCapacity', label: 'Volunteer capacity', type: 'number', hint: 'Applications stop automatically at this number.' },
      { name: 'volunteerRoles', label: 'Volunteer roles (one per line)', type: 'list', full: true },
    ],
    columns: [
      { label: 'Event', get: (r) => r.title, primary: true },
      { label: 'Date', get: (r) => formatDate(r.date) },
      { label: 'Registered', get: (r, db) => `${count(db, 'eventRegistrations', 'eventId', r.id)}${Number(r.registrationCapacity) ? ` / ${r.registrationCapacity}` : ''}` },
      { label: 'Volunteers', get: (r, db) => { const n = count(db, 'volunteers', 'eventId', r.id); return n >= Number(r.volunteerCapacity) ? `Full (${n}/${r.volunteerCapacity})` : `${n} / ${r.volunteerCapacity}` } },
    ],
    children: [
      { collection: 'volunteers', key: 'eventId', label: 'Volunteers' },
      { collection: 'eventRegistrations', key: 'eventId', label: 'Registrations' },
    ],
  },

  sessions: {
    label: 'Online sessions', singular: 'Session',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, full: true },
      { name: 'host', label: 'Host', type: 'text', required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Zoom', 'Google Meet', 'Microsoft Teams', 'Other'], required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'durationMins', label: 'Duration (minutes)', type: 'number' },
      { name: 'capacity', label: 'Participant capacity', type: 'number', required: true, hint: 'Registration closes automatically when full.' },
      { name: 'meetingLink', label: 'Meeting link', type: 'url', full: true, hint: 'Shown to students right after they register.' },
      { name: 'zoomMeetingId', label: 'Zoom meeting ID (future API use)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
    ],
    columns: [
      { label: 'Session', get: (r) => r.title, primary: true },
      { label: 'When', get: (r) => `${formatDate(r.date)} · ${r.time}` },
      { label: 'Registered', get: (r, db) => `${count(db, 'sessionRegistrations', 'sessionId', r.id)} / ${r.capacity}` },
      { label: 'Link', get: (r) => (r.meetingLink ? 'Set' : 'Missing') },
    ],
    children: [{ collection: 'sessionRegistrations', key: 'sessionId', label: 'Registrations' }],
  },

  members: {
    label: 'Members', singular: 'Member',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'college', label: 'College', type: 'text' },
      { name: 'course', label: 'Course', type: 'text' },
      { name: 'year', label: 'Year', type: 'text' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'skills', label: 'Skills', type: 'text' },
      { name: 'interests', label: 'Interests (one per line)', type: 'list', full: true },
      { name: 'active', label: 'Active member', type: 'checkbox' },
    ],
    columns: [
      { label: 'Name', get: (r) => r.name, primary: true },
      { label: 'Email', get: (r) => r.email },
      { label: 'College', get: (r) => r.college },
      { label: 'City', get: (r) => r.city },
      { label: 'Joined', get: (r) => (r.createdAt ? formatDate(r.createdAt.slice(0, 10)) : '') },
    ],
  },

  placements: {
    label: 'Placements', singular: 'Placement',
    fields: [
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'studentsPlaced', label: 'Students placed', type: 'number', required: true },
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'roles', label: 'Roles (one per line)', type: 'list' },
      { name: 'students', label: 'Student names (optional, with consent)', type: 'list' },
    ],
    columns: [
      { label: 'Company', get: (r) => r.company, primary: true },
      { label: 'Placed', get: (r) => r.studentsPlaced },
      { label: 'Roles', get: (r) => (r.roles || []).join(', ') },
    ],
  },

  services: {
    label: 'Services', singular: 'Service',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: iconNames },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true, full: true },
      { name: 'provides', label: 'What we provide (one per line)', type: 'list', full: true },
      { name: 'forWhom', label: 'Who it’s for', type: 'textarea', full: true },
      { name: 'howToApproach', label: 'How to approach', type: 'textarea', full: true },
      { name: 'contactPerson', label: 'Contact person / team', type: 'text' },
      { name: 'contactEmail', label: 'Contact email (optional — socials shown if empty)', type: 'email' },
      { name: 'contactPhone', label: 'Contact phone', type: 'text' },
    ],
    columns: [
      { label: 'Service', get: (r) => r.name, primary: true },
      { label: 'Contact', get: (r) => r.contactPerson },
      { label: 'Email', get: (r) => r.contactEmail },
    ],
  },

  team: {
    label: 'Team', singular: 'Team member',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true, hint: 'e.g. Founder, Director — Operations' },
      { name: 'group', label: 'Group', type: 'select', options: ['leadership', 'core'], required: true, hint: 'leadership = Founder & Directors · core = core team' },
      { name: 'responsibility', label: 'Area of responsibility', type: 'text' },
      { name: 'bio', label: 'Short bio', type: 'textarea', full: true },
      { name: 'photo', label: 'Photo URL', type: 'url', full: true, hint: 'Initials are shown until a photo is added.' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { name: 'instagram', label: 'Instagram URL', type: 'url' },
    ],
    columns: [
      { label: 'Name', get: (r) => r.name, primary: true },
      { label: 'Designation', get: (r) => r.designation },
      { label: 'Group', get: (r) => r.group },
      { label: 'Responsibility', get: (r) => r.responsibility },
    ],
  },

  talents: {
    label: 'Talent', singular: 'Talent profile',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'talent', label: 'Talent (shown on the card)', type: 'text', required: true, hint: 'e.g. Bharatanatyam dancer' },
      { name: 'category', label: 'Category', type: 'select', options: ['Music', 'Dance', 'Art', 'Photography', 'Tech', 'Writing', 'Comedy', 'Sports', 'Other'], required: true },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'bio', label: 'Short bio', type: 'textarea', full: true },
      { name: 'photo', label: 'Photo URL', type: 'url', full: true, hint: 'Portrait photo works best. Unsplash links are auto-resized.' },
      { name: 'credit', label: 'Photo credit', type: 'text' },
      { name: 'instagram', label: 'Instagram URL', type: 'url' },
    ],
    columns: [
      { label: 'Name', get: (r) => r.name, primary: true },
      { label: 'Talent', get: (r) => r.talent },
      { label: 'Category', get: (r) => r.category },
      { label: 'City', get: (r) => r.city },
    ],
  },

  ambassadors: {
    label: 'Ambassadors', singular: 'Ambassador application', readOnly: true,
    fields: [
      { name: 'status', label: 'Status', type: 'select', options: ['New', 'Call scheduled', 'Selected', 'Active ambassador', 'Not selected'] },
      { name: 'notes', label: 'Team notes', type: 'textarea', full: true },
    ],
    columns: [
      { label: 'Name', get: (r) => r.name, primary: true },
      { label: 'College', get: (r) => r.college },
      { label: 'City', get: (r) => r.city },
      { label: 'Phone', get: (r) => r.phone },
      { label: 'Status', get: (r) => r.status },
    ],
  },

  applications: {
    label: 'Applications', singular: 'Application', readOnly: true,
    fields: [{ name: 'status', label: 'Status', type: 'select', options: ['New', 'Shortlisted', 'Contacted', 'Rejected'] }],
    columns: [
      { label: 'Name', get: (r) => r.name, primary: true },
      { label: 'Opportunity', get: (r, db) => db.opportunities.find((o) => o.id === r.opportunityId)?.title || '—' },
      { label: 'Email', get: (r) => r.email },
      { label: 'Status', get: (r) => r.status },
    ],
  },

  enquiries: {
    label: 'Enquiries', singular: 'Enquiry', readOnly: true,
    fields: [{ name: 'status', label: 'Status', type: 'select', options: ['New', 'Replied', 'Closed'] }],
    columns: [
      { label: 'From', get: (r) => r.name, primary: true },
      { label: 'Type', get: (r) => r.type },
      { label: 'Message', get: (r) => r.message },
      { label: 'Status', get: (r) => r.status },
    ],
  },
}

export const childSchemas = {
  volunteers: ['name', 'email', 'phone', 'college', 'role', 'createdAt'],
  eventRegistrations: ['name', 'email', 'phone', 'college', 'createdAt'],
  sessionRegistrations: ['name', 'email', 'phone', 'college', 'createdAt'],
  applications: ['name', 'email', 'phone', 'college', 'note', 'status', 'createdAt'],
}
