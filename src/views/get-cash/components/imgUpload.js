import { Uploader, Icon } from 'vant';

export default {
  name: 'imgUploads',
  data () {
    return {

    };
  },
  props: [
    'iconName',
    'iconText',
  ],
  components: {
    'van-uploader': Uploader,
    'van-icon': Icon,
  },
  render (h) {
    return h('van-uploader', {
      props: {
        afterRead: this.onRead,
      },
    }, [
      h('van-icon', {
        props: {
          name: this.iconName,
        },
      }
      ),
    ]);
  },
  methods: {
    onRead (file) {
      document.getElementsByClassName('van-col-8')[0].style.backgroundImage = `url(${file.content})`;
    },

  },
};
