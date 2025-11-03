<script setup lang="ts">
definePageMeta({
  title: 'Asset Details',
  async validate({ params }) {
    return !!params.id;
  },
});
</script>
