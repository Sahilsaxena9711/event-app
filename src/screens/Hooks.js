// import React, {useState, memo} from 'react';

// export const Hooks = () => {
//     let name = useMyInput("Sahil");
//     let age = useMyInput("21");
//     console.log(name, age)
//     return(
//         <div>
//             <p>{age.value}</p>
//             <Name name={name.value} />
//             <input {...name}/>
//             <input {...age}/>
//         </div>
//     )
// };

// const useMyInput = (initial) => {
//     const [value, setValue] = useState(initial);
//     const handleChange = e => {
//         setValue(e.target.value);
//     }
//     return {
//         value,
//         onChange: handleChange
//     }
// }

// const Name = memo(props => {
//     console.log(props)
//     return(
//         <p>{props.name}</p>
//     )
// });

import React from 'react';

// export const Hooks = () => {
//     const ref = React.createRef();
//     return(
//         <MyComp ref={ref} />
//     )
// } 

// const MyComp = React.forwardRef((props,ref) => {
//     console.log(props, ref)
//     return(
//         <>
//             hello
//         </>
//     )
// })

const OtherComponent = React.lazy(() => import('../components/Loader/loader.js'));

export function Hooks() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<p>cdcee{console.log('ceer')}</p>}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}