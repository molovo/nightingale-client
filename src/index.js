const URL = '<%= url %>'
const VISIT_KEY = 'nightingale-visit'

/**
 * The Nightingale browser client
 */
export default class Nightingale {
  /**
   * The websocket connection
   *
   * @type {WebSocket}
   */
  socket = null

  /**
   * The site ID
   *
   * @type {string}
   */
  siteId = null

  /**
   * The visit ID for this session
   *
   * @type {string}
   */
  visitId = null

  /**
   * The event queue
   *
   * @type {array}
   */
  queue = []

  /**
   * The session start time
   *
   * @type {int}
   */
  startTime = (new Date).getTime()

  /**
   * Create the client instance, start the session, and setup listeners
   * for autotracked events
   *
   * @param {string} siteId
   * @param {int}    startTime
   * @param {array}  queue
   */
  constructor(siteId, startTime, queue) {
    this.siteId = siteId
    this.startTime = startTime || (new Date()).getTime()
    this.queue = queue || []

    // Check for the siteId to ensure the tracking snippet
    // has been embedded correctly. Without this, we can't connect
    if (typeof siteId === 'undefined') {
      console.error('Cannot find Nightingale site ID. Please ensure you have copied and pasted the nightingale tracker snippet exactly')
      return
    }

    // Retrieve the visitId from sessionStorage if set
    const visitId = sessionStorage.getItem(VISIT_KEY)
    if (visitId !== null) {
      this.visitId = visitId
    }

    // Connect to the server
    this.connect()
  }

  /**
   * Connect to the server
   */
  connect() {
    this.socket = new WebSocket(URL)
    this.socket.addEventListener('open', this.start.bind(this))
    this.socket.addEventListener('message', this.receive.bind(this))
  }

  /**
   * Start the session
   *
   * @param {Event} evt
   */
  start(evt) {
    this.send({
      event: 'start',
      site: this.siteId,
      visit: this.visitId || null,
      url: location.href,
      referrer: document.referrer,
      timestamp: this.startTime
    })
    
    // Send any events which were buffered before the client was instantiated
    this.sendBufferedEvents()

    // Set up event listeners for user interactions
    this.setupEventListeners()
  }

  /**
   * Trigger a navigation event to the given URL
   *
   * @param {string} url
   */
  navigate(url) {
    url = url || location.href
    this.send({
      event: 'navigate',
      url: url
    })
  }
  
  /**
   * Send the current scroll position
   */
  scroll() {
    this.send({
      event: 'scroll',
      scroll_distance: window.pageYOffset
    })
  }

  /**
   * Record an event
   *
   * @param {string} name
   * @param {object} data
   */
  event(name, data) {
    if (['start', 'navigate', 'scroll'].includes(name)) {
      return this[name](data)
    }

    this.send({
      event: name,
      metadata: data
    })
  }

  /**
   * Send JSON-encoded data to the server
   *
   * @param {object} data
   */
  send(data) {
    this.socket.send(JSON.stringify(data))
  }

  /**
   * Receive responses from the server and handle them
   *
   * @param {MessageEvent} message
   */
  receive(message) {
    // Parse the JSON response
    const data = JSON.parse(message.data)

    // If a visit ID is sent, store it for this session
    if (data.visit !== null) {
      this.visitId = data.visit
      sessionStorage.setItem(VISIT_KEY, data.visit)
    }
  }

  /**
   * Send any events which were buffered before the client was instantiated
   */
  sendBufferedEvents() {
    this.queue = this.queue.filter((event) => {
      this.event(...event)
      return false
    })
  }

  /**
   * Set up event listeners for user interactions
   */
  setupEventListeners() {
    // Bind a listener to the scroll event, which sends the resting
    // scroll position to the server so scroll_distance can be
    // updated for this pageview
    window.addEventListener('scroll', (e) => {
      clearTimeout(window.nightingaleScrollBuffer)
      window.nightingaleScrollBuffer = setTimeout(this.scroll.bind(this), 100)
    })
  }
}

//
if (typeof window !== 'undefined') {
  const {i, t, q} = window.ntgl
  const client = new Nightingale(i, t, q)
  window.ntgl = client.event.bind(client)
}