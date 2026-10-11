import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents, setLoading, setError, setSearchTerm, setCategory, setPage } from '../store/eventsSlice';
import EventCard from '../components/EventCard';

const API_KEY = import.meta.env.VITE_TM_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const CATEGORIES = ['', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];

function Events() {
  const dispatch = useDispatch();
  const { events, loading, error, searchTerm, category, page, totalPages } = useSelector(
    (state) => state.events
  );

  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, category, page]);

  async function fetchEvents() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      let url = `${BASE_URL}?apikey=${API_KEY}&size=12&page=${page - 1}`;
      if (searchTerm) url += `&keyword=${encodeURIComponent(searchTerm)}`;
      if (category) url += `&classificationName=${encodeURIComponent(category)}`;

      const response = await fetch(url);
      const data = await response.json();

      const eventList = data._embedded?.events || [];
      const total = data.page?.totalPages || 1;

      dispatch(setEvents({ events: eventList, totalPages: total > 50 ? 50 : total }));
    } catch (err) {
      dispatch(setError('Failed to load events. Check your API key.'));
    }
    dispatch(setLoading(false));
  }

  function handleSearch(e) {
    e.preventDefault();
    dispatch(setSearchTerm(inputValue));
  }

  function handleCategoryChange(e) {
    dispatch(setCategory(e.target.value));
  }

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>

      <div className="filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search events..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
        <select value={category} onChange={handleCategoryChange} className="category-select">
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
          ))}
        </select>
      </div>

      {loading && <p className="loading-msg">Loading events...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="no-events">No events found.</p>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page === 1}
            className="btn-page"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page === totalPages}
            className="btn-page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Events;
