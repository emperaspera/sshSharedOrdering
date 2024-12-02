import * as React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

export default function Ratings({ initialRating, onRatingChange }) {
    const [value, setValue] = React.useState(initialRating);

    const handlesTheRatingChange = (event, newValue) => {
        event.stopPropagation();
        setValue(newValue);
        onRatingChange(newValue);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={(event) => handlesTheRatingChange(event, star)}
                    style={{ cursor: 'pointer', color: star <= value ? 'gold' : 'gray' }}
                >
                    {star <= value ? <FaStar /> : <FaRegStar />}
                </span>
            ))}
        </div>
    );
}