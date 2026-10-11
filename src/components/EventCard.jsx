import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const image = event.images && event.images[0] ? event.images[0].url : null;
  const date = event.dates?.start?.localDate || 'TBA';
  const time = event.dates?.start?.localTime || '';
  const venue = event._embedded?.venues?.[0];
  const venueName = venue ? venue.name : 'Venue TBA';
  const city = venue?.city?.name || '';
  const country = venue?.country?.name || '';
  const category = event.classifications?.[0]?.segment?.name || 'Event';

  return (
    <div className="event-card">
      {image && <img src={image} alt={event.name} className="event-card-img" />}
      {!image && <div className="event-card-img-placeholder">No Image</div>}
      <div className="event-card-body">
        <span className="event-category">{category}</span>
        <h3 className="event-name">{event.name}</h3>
        <p className="event-date">{date} {time && `at ${time}`}</p>
        <p className="event-venue">{venueName}{city ? `, ${city}` : ''}{country ? `, ${country}` : ''}</p>
        <Link to={`/events/${event.id}`} className="btn-details">View Details</Link>
      </div>
    </div>
  );
}

export default EventCard;
