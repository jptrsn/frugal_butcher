document.onreadystatechange = (ev) => {
    console.log('onreadystatechange', document.readyState);
    
    if (document.readyState === 'complete') {
        const meetActions = new MeetActions();
    }
}