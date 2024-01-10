import Layout from '@layouts/VerticalLayout'
import navigation from '@src/navigation/vertical'

const VerticalLayout = props => {
  return (
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  )
}

export default VerticalLayout
