import { useSelector, useDispatch } from 'react-redux';
import { cancelRegistration } from '../store/registrationsSlice';
import { Link } from 'react-router-dom';

function MyEvents() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { registrations } = useSelector((state) => state.registrations);

  const myRegistrations = registrations.filter((r) => r.userEmail === user?.email);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = myRegistrations.filter((r) => {
    const date = r.event.dates?.start?.localDate;
    if (!date) return true;
    return new Date(date) >= today;
  });

  const past = myRegistrations.filter((r) => {
    const date = r.event.dates?.start?.localDate;
    if (!date) return false;
    return new Date(date) < today;
  });

  function handleCancel(eventId) {
    dispatch(cancelRegistration({ userEmail: user.email, eventId }));
  }

  function renderCard(reg, canCancel) {
    const event = reg.event;
    const image = event.images?.[0]?.url;
    const date = event.dates?.start?.localDate || 'TBA';
    const venue = event._embedded?.venues?.[0];
    const venueName = venue?.name || 'Venue TBA';
    const city = venue?.city?.name || '';

    return (
      <div key={event.id} className="my-event-card">
        {image && <img src={image} alt={event.name} className="my-event-img" />}
        <div className="my-event-body">
          <h3>{event.name}</h3>
          <p>{date}</p>
          <p>{venueName}{city ? `, ${city}` : ''}</p>
          <div className="my-event-actions">
            <Link to={`/events/${event.id}`} className="btn-details">View</Link>
            {canCancel && (
              <button onClick={() => handleCancel(event.id)} className="btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <h1>My Events</h1>

      {myRegistrations.length === 0 && (
        <div className="empty-state">
          <p>No registered events yet.</p>
          <Link to="/events" className="btn-primary">Browse Events</Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2>Upcoming ({upcoming.length})</h2>
          <div className="my-events-grid">
            {upcoming.map((reg) => renderCard(reg, true))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2>Past Events ({past.length})</h2>
          <div className="my-events-grid">
            {past.map((reg) => renderCard(reg, false))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MyEvents;
