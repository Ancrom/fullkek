export default function SvgSprite() {
  return (
    <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
      <symbol id="icon-edit" viewBox="0 0 24 24">
        <path
          d="M12 21H22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9813 2.6895C17.4228 2.24802 18.0216 2 18.6459 2C18.9551 2 19.2612 2.06089 19.5468 2.17919C19.8324 2.2975 20.0919 2.4709 20.3105 2.6895C20.5291 2.90809 20.7025 3.16761 20.8208 3.45322C20.9391 3.73883 21 4.04494 21 4.35409C21 4.66323 20.9391 4.96935 20.8208 5.25496C20.7025 5.54057 20.5291 5.80008 20.3105 6.01868L6.43891 19.8903L2 21L3.10973 16.5611L16.9813 2.6895Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </symbol>
      <symbol id="icon-spinner" viewBox="0 0 24 24">
        <style>
          {`.spinner {
        			transform-origin: center;
       				animation: spin .75s infinite linear;
      			}
      			@keyframes spin {
        			100% { transform: rotate(360deg); }
      			}`}
        </style>
        <path
          className="spinner"
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          fill="currentColor"
        />
      </symbol>
    </svg>
  );
}
