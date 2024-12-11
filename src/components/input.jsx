
/// SOURCE: https://uiverse.io/ahmedyasserdev/funny-treefrog-48 -Mert
// eslint-disable-next-line react/prop-types
function Input({ value, onChange }) {
    return (
        <form className='relative form' onSubmit={(e) => e.preventDefault()}>
            <button className='p-1 absolute top-1/2 left-2 -translate-y-1/2'>
                <svg
                    className='h-5 w-5 text-gray-700'
                    width='17'
                    height='16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-labelledby='search'
                    role='img'
                >
                    <path
                        d='M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9'
                        stroke='currentColor'
                        strokeWidth='1.333'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </button>
            <input
                type='text'
                value={value}
                onChange={onChange}
                required
                placeholder='Search...'
                className='input px-8 py-3 rounded-full border-2 border-transparent focus:ring-4 focus:border-blue-500 focus:outline-none placeholder-gray-400 duration-300 shadow-md transition-all'
            />
            <button className='p-1 absolute top-1/2 right-3 -translate-y-1/2' type='reset'>
                <svg
                    className='h-5 w-5 text-gray-700'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M6 18L18 6M6 6l12 12'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </button>
        </form>
    );
}

export default Input;
