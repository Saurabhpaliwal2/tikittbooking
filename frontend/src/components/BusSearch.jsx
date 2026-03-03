import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ArrowRightLeft, Loader2, AlertCircle } from 'lucide-react';
import { busService } from '../services/api';

const BusSearch = ({ onSearch }) => {
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchCities = async () => {
            setLoadingCities(true);
            setError('');
            try {
                const response = await busService.getCities();
                setCities(response.data);
            } catch (err) {
                console.error('Error fetching cities:', err);
                setError('Failed to load cities. Please try again.');
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, []);

    const handleSwap = () => {
        setSearchParams(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchParams.from === searchParams.to) {
            setError('Source and Destination cannot be the same city.');
            return;
        }
        setError('');
        onSearch(searchParams);
    };

    return (
        <div className="search-container animate-fade-in">
            {error && (
                <div className="search-error glass">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="search-box card glass">
                <div className="input-field">
                    <label><MapPin size={14} /> FROM</label>
                    <div className="input-with-loader">
                        <input
                            type="text"
                            list="cities-from"
                            placeholder={loadingCities ? "Loading..." : "Source City"}
                            value={searchParams.from}
                            onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                            required
                        />
                        {loadingCities && <Loader2 size={14} className="animate-spin text-primary" />}
                    </div>
                    <datalist id="cities-from">
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>

                <div className="divider-container">
                    <div className="divider" />
                    <button type="button" className="swap-btn" onClick={handleSwap} title="Swap Cities">
                        <ArrowRightLeft size={16} />
                    </button>
                    <div className="divider" />
                </div>

                <div className="input-field">
                    <label><MapPin size={14} /> TO</label>
                    <div className="input-with-loader">
                        <input
                            type="text"
                            list="cities-to"
                            placeholder={loadingCities ? "Loading..." : "Destination City"}
                            value={searchParams.to}
                            onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                            required
                        />
                        {loadingCities && <Loader2 size={14} className="animate-spin text-primary" />}
                    </div>
                    <datalist id="cities-to">
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>

                <div className="divider" />

                <div className="input-field">
                    <label><Calendar size={14} /> DATE</label>
                    <input
                        type="date"
                        value={searchParams.date}
                        onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <button type="submit" className="btn-primary search-btn">
                    <Search size={20} />
                    <span>FIND BUSES</span>
                </button>
            </form>
        </div>
    );
};

export default BusSearch;
