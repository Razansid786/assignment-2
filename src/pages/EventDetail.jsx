import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEvent } from '../store/eventsSlice';
import { registerForEvent, cancelRegistration } from '../store/registrationsSlice';

const API_KEY = import.meta.env.VITE_TM_API_KEY;

function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent } = useSelector((state) => state.events);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { registrations } = useSelector((state) => state.registrations);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);

  const myRegistration = registrations.find(
    (r) => r.userEmail === user?.email && r.event.id === id
  );
  const isRegistered = Boolean(myRegistration);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  async function fetchEvent() {
    setLoading(true);
    setError(null);
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      dispatch(setSelectedEvent(data));
    } catch (err) {
      setError('Failed to load event details.');
    }
    setLoading(false);
  }

  function handleRegister() {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(registerForEvent({ userEmail: user.email, event: selectedEvent }));
    setMessage('Successfully registered for this event!');
    setConfirmCancel(false);
  }

  function handleCancelConfirm() {
    setConfirmCancel(true);
    setMessage('');
  }

  function handleCancelConfirmed() {
    dispatch(cancelRegistration({ userEmail: user.email, eventId: id }));
    setMessage('Registration cancelled.');
    setConfirmCancel(false);
  }

  function handleCancelAbort() {
    setConfirmCancel(false);
  }

  if (loading) return <p className="loading-msg">Loading event...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!selectedEvent) return null;

  const event = selectedEvent;
  const image = event.images?.find((img) => img.ratio === '16_9') || event.images?.[0];
  const venue = event._embedded?.venues?.[0];
  const date = event.dates?.start?.localDate || 'TBA';
  const time = event.dates?.start?.localTime || '';
  const category = event.classifications?.[0]?.segment?.name || '';
  const subCategory = event.classifications?.[0]?.genre?.name || '';
  const priceMin = event.priceRanges?.[0]?.min;
  const priceMax = event.priceRanges?.[0]?.max;
  const currency = event.priceRanges?.[0]?.currency || 'USD';
  const ticketUrl = event.url;

  const registeredDate = myRegistration
    ? new Date(myRegistration.registeredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="event-detail-page">
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

      {image && <img src={image.url} alt={event.name} className="event-detail-img" />}

      <div className="event-detail-content">
        <div className="event-detail-header">
          <h1>{event.name}</h1>
          {category && <span className="event-category">{category}{subCategory && subCategory !== 'Undefined' ? ` / ${subCategory}` : ''}</span>}
        </div>

        <div className="event-detail-info">
          <div className="info-item">
            <strong>Date</strong>
            <span>{date} {time && `at ${time}`}</span>
          </div>
          {venue && (
            <div className="info-item">
              <strong>Venue</strong>
              <span>{venue.name}</span>
            </div>
          )}
          {venue && (
            <div className="info-item">
              <strong>Location</strong>
              <span>
                {[venue.address?.line1, venue.city?.name, venue.state?.name, venue.country?.name]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}
          {priceMin && (
            <div className="info-item">
              <strong>Price</strong>
              <span>{currency} {priceMin} – {priceMax}</span>
            </div>
          )}
        </div>

        {event.info && <p className="event-description">{event.info}</p>}
        {event.pleaseNote && <p className="event-note"><strong>Note:</strong> {event.pleaseNote}</p>}

        {message && <p className="success-msg">{message}</p>}

        <div className="event-actions">
          {!isRegistered ? (
            <button onClick={handleRegister} className="btn-primary">
              {isLoggedIn ? 'Register for Event' : 'Login to Register'}
            </button>
          ) : (
            <div className="registration-status">
              <div className="registered-info">
                <span className="registered-badge">Registered</span>
                {registeredDate && (
                  <span className="registered-on">Registered on {registeredDate}</span>
                )}
              </div>

              {!confirmCancel ? (
                <button onClick={handleCancelConfirm} className="btn-cancel">
                  Cancel Registration
                </button>
              ) : (
                <div className="cancel-confirm">
                  <p>Are you sure you want to cancel?</p>
                  <button onClick={handleCancelConfirmed} className="btn-cancel">Yes, Cancel</button>
                  <button onClick={handleCancelAbort} className="btn-keep">Keep Registration</button>
                </div>
              )}
            </div>
          )}

          {ticketUrl && (
            <a href={ticketUrl} target="_blank" rel="noreferrer" className="btn-ticket">
              Buy Tickets
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
