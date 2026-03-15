-- Blood Bridge MVP demo seed
-- This file seeds donor/staff profiles for demo views.
-- Note: these are seeded profiles (auth_user_id is null), not Auth login accounts.

insert into public.profiles (id, role, full_name, email, phone, parish, auth_user_id)
values
  ('00000000-0000-0000-0000-000000000101', 'blood_bank_staff', 'Alicia Morgan', 'alicia.staff@bloodbridge.demo', '+1-876-555-0101', 'Kingston', null),
  ('00000000-0000-0000-0000-000000000102', 'blood_bank_staff', 'David Clarke', 'david.staff@bloodbridge.demo', '+1-876-555-0102', 'St. James', null),
  ('00000000-0000-0000-0000-000000000103', 'admin', 'Grace Bennett', 'admin@bloodbridge.demo', '+1-876-555-0103', 'Kingston', null),
  ('00000000-0000-0000-0000-000000000201', 'donor', 'Shanice Thompson', 'shanice.donor@bloodbridge.demo', '+1-876-555-0201', 'Kingston', null),
  ('00000000-0000-0000-0000-000000000202', 'donor', 'Michael Brown', 'michael.donor@bloodbridge.demo', '+1-876-555-0202', 'St. Catherine', null),
  ('00000000-0000-0000-0000-000000000203', 'donor', 'Aaliyah Grant', 'aaliyah.donor@bloodbridge.demo', '+1-876-555-0203', 'St. Ann', null),
  ('00000000-0000-0000-0000-000000000204', 'donor', 'Javon Williams', 'javon.donor@bloodbridge.demo', '+1-876-555-0204', 'Manchester', null),
  ('00000000-0000-0000-0000-000000000205', 'donor', 'Tanesha Reid', 'tanesha.donor@bloodbridge.demo', '+1-876-555-0205', 'Clarendon', null),
  ('00000000-0000-0000-0000-000000000206', 'donor', 'Kemar Foster', 'kemar.donor@bloodbridge.demo', '+1-876-555-0206', 'St. James', null)
on conflict (id) do update
set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  parish = excluded.parish;

insert into public.donor_profiles (
  profile_id,
  blood_type,
  date_of_birth,
  emergency_contact,
  status,
  next_eligible_donation_date,
  last_donation_date,
  notes
)
values
  ('00000000-0000-0000-0000-000000000201', 'O+', '1992-07-11', 'Tricia Thompson (+1-876-555-1101)', 'approved', current_date + 15, current_date - 75, 'Frequent donor'),
  ('00000000-0000-0000-0000-000000000202', 'A-', '1988-12-02', 'Marlon Brown (+1-876-555-1102)', 'temporarily_deferred', current_date + 45, current_date - 20, 'Deferred due to low haemoglobin, review pending'),
  ('00000000-0000-0000-0000-000000000203', 'B+', '1995-03-22', null, 'pending_verification', null, null, 'Needs full onboarding'),
  ('00000000-0000-0000-0000-000000000204', 'AB+', '1990-10-09', 'Danielle Williams (+1-876-555-1104)', 'approved', current_date + 2, current_date - 118, null),
  ('00000000-0000-0000-0000-000000000205', 'O-', '1999-05-17', null, 'eligible_again', current_date, current_date - 130, 'Universal donor'),
  ('00000000-0000-0000-0000-000000000206', 'A+', '1986-01-30', 'Kerri Foster (+1-876-555-1106)', 'approved', current_date + 12, current_date - 77, null)
on conflict (profile_id) do update
set
  blood_type = excluded.blood_type,
  date_of_birth = excluded.date_of_birth,
  emergency_contact = excluded.emergency_contact,
  status = excluded.status,
  next_eligible_donation_date = excluded.next_eligible_donation_date,
  last_donation_date = excluded.last_donation_date,
  notes = excluded.notes;

insert into public.donor_verification_steps (
  donor_profile_id,
  registered,
  id_verified,
  medical_screening_completed,
  haemoglobin_check_completed,
  medical_interview_completed,
  approval_outcome,
  updated_by_profile_id
)
values
  ('00000000-0000-0000-0000-000000000201', true, true, true, true, true, 'approved', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000202', true, true, true, false, false, 'temporarily_deferred', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000203', true, false, false, false, false, 'pending_verification', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000204', true, true, true, true, true, 'approved', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000205', true, true, true, true, true, 'eligible_again', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000206', true, true, true, true, true, 'approved', '00000000-0000-0000-0000-000000000102')
on conflict (donor_profile_id) do update
set
  registered = excluded.registered,
  id_verified = excluded.id_verified,
  medical_screening_completed = excluded.medical_screening_completed,
  haemoglobin_check_completed = excluded.haemoglobin_check_completed,
  medical_interview_completed = excluded.medical_interview_completed,
  approval_outcome = excluded.approval_outcome,
  updated_by_profile_id = excluded.updated_by_profile_id;

insert into public.blood_centres (id, name, parish, address, latitude, longitude, phone, is_active)
values
  (1, 'Kingston National Blood Centre', 'Kingston', '21 Slipe Pen Road, Kingston', 18.001450, -76.792400, '+1-876-555-3001', true),
  (2, 'Montego Bay Regional Centre', 'St. James', '18 Barnett Street, Montego Bay', 18.466300, -77.916900, '+1-876-555-3002', true),
  (3, 'Mandeville Collection Point', 'Manchester', '4 Caledonia Road, Mandeville', 18.041700, -77.507000, '+1-876-555-3003', true)
on conflict (id) do update
set
  name = excluded.name,
  parish = excluded.parish,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  phone = excluded.phone,
  is_active = excluded.is_active;

insert into public.blood_requests (
  id,
  created_by_profile_id,
  blood_type_needed,
  urgency,
  centre_id,
  required_by,
  note,
  status,
  ai_message_suggestions
)
values
  (
    1,
    '00000000-0000-0000-0000-000000000101',
    'O-',
    'critical',
    1,
    current_date + 1,
    'Emergency trauma support for overnight admissions.',
    'active',
    jsonb_build_array(
      'Urgent: O- donors needed at Kingston National Blood Centre by tomorrow morning.',
      'You may be eligible to donate now. Please confirm availability for a same-day appointment.'
    )
  ),
  (
    2,
    '00000000-0000-0000-0000-000000000102',
    'A+',
    'high',
    2,
    current_date + 2,
    'Surgery schedule increased for next 48 hours.',
    'active',
    jsonb_build_array(
      'High-priority A+ request in Montego Bay. Book your donation slot if available.',
      'Your previous donation record suggests you may be due for another safe donation soon.'
    )
  ),
  (
    3,
    '00000000-0000-0000-0000-000000000101',
    'B+',
    'medium',
    3,
    current_date + 5,
    'Routine stock balancing across parishes.',
    'active',
    jsonb_build_array(
      'B+ donors requested this week at Mandeville Collection Point.',
      'If your screening is complete, choose a convenient appointment time.'
    )
  )
on conflict (id) do update
set
  created_by_profile_id = excluded.created_by_profile_id,
  blood_type_needed = excluded.blood_type_needed,
  urgency = excluded.urgency,
  centre_id = excluded.centre_id,
  required_by = excluded.required_by,
  note = excluded.note,
  status = excluded.status,
  ai_message_suggestions = excluded.ai_message_suggestions;

insert into public.appointments (
  id,
  donor_profile_id,
  created_by_profile_id,
  blood_request_id,
  centre_id,
  appointment_type,
  status,
  scheduled_at,
  notes
)
values
  (1, '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 1, 1, 'donation', 'scheduled', now() + interval '1 day', 'Priority donation slot'),
  (2, '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', null, 2, 'blood_typing', 'scheduled', now() + interval '2 days', 'First-time typing'),
  (3, '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', null, 1, 'screening', 'scheduled', now() + interval '3 days', 'Re-screen after temporary deferral'),
  (4, '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 2, 2, 'donation', 'completed', now() - interval '8 days', 'Completed successfully'),
  (5, '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000101', 1, 1, 'donation', 'completed', now() - interval '40 days', 'Critical response donation'),
  (6, '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102', 2, 2, 'screening', 'completed', now() - interval '12 days', 'Routine annual screen')
on conflict (id) do update
set
  donor_profile_id = excluded.donor_profile_id,
  created_by_profile_id = excluded.created_by_profile_id,
  blood_request_id = excluded.blood_request_id,
  centre_id = excluded.centre_id,
  appointment_type = excluded.appointment_type,
  status = excluded.status,
  scheduled_at = excluded.scheduled_at,
  notes = excluded.notes;

insert into public.donation_history (
  id,
  donor_profile_id,
  centre_id,
  appointment_id,
  donated_at,
  blood_type,
  units,
  notes
)
values
  (1, '00000000-0000-0000-0000-000000000204', 2, 4, now() - interval '8 days', 'AB+', 1.0, 'No adverse events'),
  (2, '00000000-0000-0000-0000-000000000205', 1, 5, now() - interval '40 days', 'O-', 1.0, 'Emergency reserve contribution'),
  (3, '00000000-0000-0000-0000-000000000201', 1, null, now() - interval '75 days', 'O+', 1.0, 'Routine donation')
on conflict (id) do update
set
  donor_profile_id = excluded.donor_profile_id,
  centre_id = excluded.centre_id,
  appointment_id = excluded.appointment_id,
  donated_at = excluded.donated_at,
  blood_type = excluded.blood_type,
  units = excluded.units,
  notes = excluded.notes;

insert into public.donor_alerts (
  id,
  blood_request_id,
  donor_profile_id,
  sent_by_profile_id,
  message
)
values
  (1, 1, '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000101', 'Critical O- need at Kingston. Can you donate in the next 24 hours?'),
  (2, 1, '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Urgent O request. Please confirm if you can attend tomorrow morning.'),
  (3, 2, '00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102', 'A+ request in Montego Bay. Slots available this afternoon.'),
  (4, 3, '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'B+ outreach: complete screening to join upcoming donor drive.'),
  (5, 2, '00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'A+ follow-up request for elective surgery coverage.')
on conflict (id) do update
set
  blood_request_id = excluded.blood_request_id,
  donor_profile_id = excluded.donor_profile_id,
  sent_by_profile_id = excluded.sent_by_profile_id,
  message = excluded.message;

insert into public.donor_alert_responses (
  id,
  alert_id,
  donor_profile_id,
  response_status,
  responded_at,
  note
)
values
  (1, 1, '00000000-0000-0000-0000-000000000205', 'booked', now() - interval '3 hours', 'Booked for tomorrow 9:00 AM'),
  (2, 2, '00000000-0000-0000-0000-000000000201', 'interested', now() - interval '2 hours', 'Can come after work'),
  (3, 3, '00000000-0000-0000-0000-000000000206', 'unavailable', now() - interval '1 day', 'Out of parish this week'),
  (4, 4, '00000000-0000-0000-0000-000000000203', 'pending', null, null),
  (5, 5, '00000000-0000-0000-0000-000000000204', 'booked', now() - interval '4 hours', 'Booked for 2pm slot')
on conflict (id) do update
set
  alert_id = excluded.alert_id,
  donor_profile_id = excluded.donor_profile_id,
  response_status = excluded.response_status,
  responded_at = excluded.responded_at,
  note = excluded.note;

insert into public.notifications (
  id,
  recipient_profile_id,
  source_type,
  source_id,
  title,
  body,
  is_read
)
values
  (1, '00000000-0000-0000-0000-000000000205', 'alert', 1, 'Critical blood request', 'Please confirm your availability for O- donation.', false),
  (2, '00000000-0000-0000-0000-000000000201', 'appointment', 1, 'Upcoming donation appointment', 'Your appointment is scheduled for tomorrow.', false),
  (3, '00000000-0000-0000-0000-000000000102', 'response', 2, 'New donor response', 'A donor marked interested in your urgent request.', false)
on conflict (id) do update
set
  recipient_profile_id = excluded.recipient_profile_id,
  source_type = excluded.source_type,
  source_id = excluded.source_id,
  title = excluded.title,
  body = excluded.body,
  is_read = excluded.is_read;

select setval(pg_get_serial_sequence('public.blood_centres', 'id'), coalesce((select max(id) from public.blood_centres), 1), true);
select setval(pg_get_serial_sequence('public.blood_requests', 'id'), coalesce((select max(id) from public.blood_requests), 1), true);
select setval(pg_get_serial_sequence('public.appointments', 'id'), coalesce((select max(id) from public.appointments), 1), true);
select setval(pg_get_serial_sequence('public.donation_history', 'id'), coalesce((select max(id) from public.donation_history), 1), true);
select setval(pg_get_serial_sequence('public.donor_alerts', 'id'), coalesce((select max(id) from public.donor_alerts), 1), true);
select setval(pg_get_serial_sequence('public.donor_alert_responses', 'id'), coalesce((select max(id) from public.donor_alert_responses), 1), true);
select setval(pg_get_serial_sequence('public.notifications', 'id'), coalesce((select max(id) from public.notifications), 1), true);
