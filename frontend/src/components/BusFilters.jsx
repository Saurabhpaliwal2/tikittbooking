import React from 'react';
import { Filter, X } from 'lucide-react';

const BusFilters = ({ filters, setFilters, availableOperators = [] }) => {

    const handlePriceChange = (value) => {
        setFilters(prev => ({ ...prev, price: value }));
    };

    const handleSortChange = (value) => {
        setFilters(prev => ({ ...prev, sortBy: value }));
    };

    const handleBusTypeToggle = (type) => {
        setFilters(prev => {
            const types = prev.busTypes.includes(type)
                ? prev.busTypes.filter(t => t !== type)
                : [...prev.busTypes, type];
            return { ...prev, busTypes: types };
        });
    };

    const handleTimeToggle = (time) => {
        setFilters(prev => {
            const times = prev.departureTimes.includes(time)
                ? prev.departureTimes.filter(t => t !== time)
                : [...prev.departureTimes, time];
            return { ...prev, departureTimes: times };
        });
    };

    const handleOperatorToggle = (operator) => {
        setFilters(prev => {
            const ops = prev.operators.includes(operator)
                ? prev.operators.filter(o => o !== operator)
                : [...prev.operators, operator];
            return { ...prev, operators: ops };
        });
    };

    const clearFilters = () => {
        setFilters({
            price: 'all',
            busTypes: [],
            departureTimes: [],
            operators: [],
            sortBy: 'time_asc'
        });
    };

    const activeFilterCount = (filters.price !== 'all' ? 1 : 0) + filters.busTypes.length + filters.departureTimes.length + filters.operators.length + (filters.sortBy !== 'time_asc' ? 1 : 0);

    return (
        <aside className="filters-sidebar card glass animate-fade-in">
            <div className="filters-header">
                <div className="filters-title">
                    <Filter size={18} />
                    <h3>Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="filter-badge">{activeFilterCount}</span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Clear All
                    </button>
                )}
            </div>

            <div className="filter-section">
                <h4>Sort By</h4>
                <div className="filter-options">
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="sort"
                            checked={filters.sortBy === 'time_asc'}
                            onChange={() => handleSortChange('time_asc')}
                        />
                        <span className="radio-custom"></span>
                        Earliest Departure
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="sort"
                            checked={filters.sortBy === 'time_desc'}
                            onChange={() => handleSortChange('time_desc')}
                        />
                        <span className="radio-custom"></span>
                        Latest Departure
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="sort"
                            checked={filters.sortBy === 'price_asc'}
                            onChange={() => handleSortChange('price_asc')}
                        />
                        <span className="radio-custom"></span>
                        Lowest Price
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="sort"
                            checked={filters.sortBy === 'price_desc'}
                            onChange={() => handleSortChange('price_desc')}
                        />
                        <span className="radio-custom"></span>
                        Highest Price
                    </label>
                </div>
            </div>

            <hr className="filter-divider" />

            <div className="filter-section">
                <h4>Price</h4>
                <div className="filter-options">
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="price"
                            checked={filters.price === 'all'}
                            onChange={() => handlePriceChange('all')}
                        />
                        <span className="radio-custom"></span>
                        All Prices
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="price"
                            checked={filters.price === 'under500'}
                            onChange={() => handlePriceChange('under500')}
                        />
                        <span className="radio-custom"></span>
                        Under ₹500
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="price"
                            checked={filters.price === '500to1000'}
                            onChange={() => handlePriceChange('500to1000')}
                        />
                        <span className="radio-custom"></span>
                        ₹500 - ₹1000
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="price"
                            checked={filters.price === 'over1000'}
                            onChange={() => handlePriceChange('over1000')}
                        />
                        <span className="radio-custom"></span>
                        Over ₹1000
                    </label>
                </div>
            </div>

            <hr className="filter-divider" />

            <div className="filter-section">
                <h4>Bus Type</h4>
                <div className="filter-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.busTypes.includes('AC')}
                            onChange={() => handleBusTypeToggle('AC')}
                        />
                        <span className="checkbox-custom"></span>
                        AC
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.busTypes.includes('NON_AC')}
                            onChange={() => handleBusTypeToggle('NON_AC')}
                        />
                        <span className="checkbox-custom"></span>
                        Non-AC
                    </label>
                </div>
            </div>

            <hr className="filter-divider" />

            <div className="filter-section">
                <h4>Departure Time</h4>
                <div className="filter-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.departureTimes.includes('morning')}
                            onChange={() => handleTimeToggle('morning')}
                        />
                        <span className="checkbox-custom"></span>
                        Morning (6 AM - 12 PM)
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.departureTimes.includes('afternoon')}
                            onChange={() => handleTimeToggle('afternoon')}
                        />
                        <span className="checkbox-custom"></span>
                        Afternoon (12 PM - 6 PM)
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.departureTimes.includes('evening')}
                            onChange={() => handleTimeToggle('evening')}
                        />
                        <span className="checkbox-custom"></span>
                        Evening (6 PM - 12 AM)
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.departureTimes.includes('night')}
                            onChange={() => handleTimeToggle('night')}
                        />
                        <span className="checkbox-custom"></span>
                        Night (12 AM - 6 AM)
                    </label>
                </div>
            </div>

            {availableOperators.length > 0 && (
                <>
                    <hr className="filter-divider" />
                    <div className="filter-section">
                        <h4>Bus Operators</h4>
                        <div className="filter-options">
                            {availableOperators.map((operator, idx) => (
                                <label key={idx} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filters.operators.includes(operator)}
                                        onChange={() => handleOperatorToggle(operator)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    {operator}
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
};

export default BusFilters;
