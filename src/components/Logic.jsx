import React, { useEffect, useState } from 'react';

const a = 'aaaaaaaa';
const b = 'bbbbbbbb';

const Logic = () => {
    const [open, setOpen] = useState(false);
    const [xx, setXx] = useState('xx');
    const onClick = () => {
        if (!open) {
            setOpen(true);
        } else {
            setOpen(false);
        }

        console.log('before', xx);
        if (xx === 'xx') {
            setXx('xy');
        } else {
            setXx('xx');
        }
        console.log('after', xx);
    };

    console.log(a);

    useEffect(() => {
        console.log(open);
        console.log(xx);
    }, [open, xx]);

    console.log(b);
    return (
        <>
            <div style={{ margin: 100 }}>
                <h2>{xx}</h2>
                <button type='button' onClick={onClick}>
                    버튼버튼
                </button>
            </div>
        </>
    );
};

export default Logic;
