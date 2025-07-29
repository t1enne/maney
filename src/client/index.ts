import type { Alpine as IAlpine } from "alpinejs";

declare global {
  interface Window {
    Alpine: IAlpine;
    htmx: any;
  }
}

document.addEventListener("alpine:init", () => {
  const { Alpine, htmx } = window;
  
  Alpine.data("dateSelector", () => ({
    init() {},
    _navigate: ({ year, month }: { year?: string; month?: string }) => {
      const params = new URLSearchParams(window.location.search);
      const now = new Date();
      const currentMonth = now.getMonth().toString();
      const currentYear = now.getFullYear().toString();
      params.set("month", month ?? params.get("month") ?? currentMonth);
      params.set("year", year ?? params.get("year") ?? currentYear);
      const newUrl = `${
        window.location.origin + window.location.pathname
      }?${params.toString()}`;

      window.history.pushState(null, "", newUrl);
      htmx.ajax("GET", newUrl, {
        target: "#root",
        select: "#root",
        swap: "outerHTML",
        headers: { "HX-Push-Url": "true" },
      });
    },
    onYearChange(year: string) {
      this._navigate({ year });
    },
    onMonthChange(month: string) {
      this._navigate({ month });
    },
  }));

  Alpine.data("groupManager", () => ({
    showAddMember: false,
    newMemberEmail: "",
    
    toggleAddMember() {
      this.showAddMember = !this.showAddMember;
      if (this.showAddMember) {
        this.$nextTick(() => {
          this.$refs.emailInput?.focus();
        });
      }
    },
    
    addMember() {
      if (!this.newMemberEmail.trim()) return;
      
      const form = this.$refs.addMemberForm;
      if (form) {
        htmx.trigger(form, "submit");
        this.newMemberEmail = "";
        this.showAddMember = false;
      }
    },
    
    confirmRemoveMember(memberName: string) {
      return confirm(`Are you sure you want to remove ${memberName} from this group?`);
    }
  }));
});
