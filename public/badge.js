

const onReady = async ()=> {
    const badgeDiv = document.getElementById("badge")
    
    const request = await fetch('http://localhost:4000/api/badge')
    const result = await request.json()
    console.log('result', {result})
    const {bytes, kb, mb, pageCount, resourceCount, kilowatthours} = result

    badgeDiv.outerHTML = `
    <div id="badge" style="relative: absolute; top: 10px; width: 98%;">
        <h4 style="border: solid 1px blue; border-radius: 10px; padding: 10px; text-align: center">
            This site weighs ${bytes} bytes (${kb}kb or ${mb}mb) across ${pageCount} pages and ${resourceCount} resources for a total of ${kilowatthours} kWh used.
        </h4>
    </div>
    `
}

document.addEventListener('DOMContentLoaded', onReady)

