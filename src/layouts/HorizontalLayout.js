import Layout from '@layouts/HorizontalLayout'
import navigation from '@src/navigation/horizontal'

const HorizontalLayout = props => {
  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  )
}

export default HorizontalLayout
