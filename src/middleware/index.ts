// @ts-ignore
const authMiddleWare = async (resolve, root, args, context, info) => {
  console.log('######### authMiddleWare BEGIN')
  // console.log(`1. logInput: ${JSON.stringify(args)}`)
  const result = await resolve(root, args, context, info)
  console.log('######### authMiddleWare END')
  // console.log(`5. logInput`)
  return result
}

// @ts-ignore
const dataFiltering = async (resolve, root, args, context, info) => {
  console.log('######### dataFiltering beginn')
  const result = await resolve(root, args, context, info)
  console.log('######### dataFiltering END')
  return result
}

export { authMiddleWare, dataFiltering }
