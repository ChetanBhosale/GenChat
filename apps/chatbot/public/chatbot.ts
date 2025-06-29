



(() => {
    const div = document.createElement('div')
    div.style.position="fixed"
    div.style.bottom="20px"
    div.style.right="20px"
    div.style.width="400px"
    div.style.height="500px"
    div.style.border="none"
    div.style.zIndex="10000"
    div.style.borderRadius="10px"
    div.style.overflow="hidden"
    div.style.boxShadow="0 0 10px 0 rgba(0, 0, 0, 0.1)"
    div.innerHTML = `
    <div>
        <h1>Hello</h1>
    </div>
    `
    document.body.appendChild(div)   
})()