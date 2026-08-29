import { redirect } from 'next/navigation';

export default function OrganizerRoot() {
  redirect('/organizer/events');
}