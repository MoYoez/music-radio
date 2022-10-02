window.onload = async function () {
  const PLAY_LIST = await AbortFetch()
    .fetch('https://music-box.himoyo.cn/list.json')
    .then(result => result.json())
    .catch(error => {
      console.log(error)
    })
  
  if (!PLAY_LIST) return alert('获取歌曲信息失败！')

  console.log(PLAY_LIST)

  let i = Math.floor(Math.random() * PLAY_LIST.length)

  dv = new DomVisual([
    'https://tva1.sinaimg.cn/large/006pBvLrly1h6r5sgn7kfj325s1e01kx.jpg',
  ])
  av = new AudioVisual()
  av.onended = playNext

  eventBus.on('play', () => {
    av.source ? av.togglePlay() : av.play(PLAY_LIST[i], false)
  })
  eventBus.on('prev', playPrev)
  eventBus.on('next', playNext)

  function playPrev () {
    i -= 1
    if (i < 0) i = PLAY_LIST.length - 1
    av.play(PLAY_LIST[i])
  }

  function playNext () {
    i += 1
    if (i >= PLAY_LIST.length) i = 0
    av.play(PLAY_LIST[i])
  }
}

const eventBus = {
  events: {},
  on (event, fn) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(fn)
  },
  emit() {
    let e = this.events[[].shift.call(arguments)]
    if (!e || e.length < 1) return
    e.forEach(fn => {
      fn.apply(this, arguments)
    })
  }
}


function AbortFetch() {
  const controller = new AbortController()

  return {
    abort: controller.abort.bind(controller),
    fetch: function (url, params = {}) {
      return new Promise((reslove, reject) => {
        fetch(url, { signal: controller.signal, ...params }).then(result => {
          if (result.ok) return reslove(result)
          throw new Error('Network response was not ok.')
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}