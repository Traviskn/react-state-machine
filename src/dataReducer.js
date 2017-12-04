const initialData = {
  count: 0
}

export default function reducer(data=initialData, action) {
  return { count: data.count + 1 }
}

