import Vue from 'vue'
import {
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Cascader,
  Col,
  Container,
  Dialog,
  Form,
  FormItem,
  Header,
  Input,
  InputNumber,
  Main,
  Menu,
  MenuItem,
  Message,
  MessageBox,
  Option,
  Pagination,
  Row,
  Select,
  Step,
  Steps,
  Submenu,
  Switch,
  Table,
  TableColumn,
  Tag,
  Tooltip
} from 'element-ui'

Vue.use(Aside)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Button)
Vue.use(Card)
Vue.use(Cascader)
Vue.use(Col)
Vue.use(Container)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(Select)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Submenu)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Tooltip)
